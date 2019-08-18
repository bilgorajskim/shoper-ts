import Request from "./request";

export enum AuthMethod {
  UserPassword,
  Token
}

export type UserPasswordAuth = {
  method: AuthMethod.UserPassword;
  username: string;
  password: string;
};

export type TokenAuth = {
  method: AuthMethod.Token;
  accessToken: string;
  refreshToken: string;
};

export type ClientConfig = {
  auth: UserPasswordAuth | TokenAuth;
  shopUrl: string;
};

export type AuthToken = {
  accessToken: string;
  // Token creation date, timestamp in seconds
  date: number;
  // How many seconds it will live
  expiresIn: number;
};

export class Client {
  private config: ClientConfig;
  private authToken?: AuthToken;
  private endpoint: string;

  constructor(config: ClientConfig) {
    this.config = config;
    // Remove trailing slash(es)
    this.config.shopUrl = this.config.shopUrl.replace(/\/+$/, "");
    this.endpoint = `${this.config.shopUrl}/webapi/rest`;
  }

  public async iterateUsers(sort?: any, filters?: string) {
    return this.iterateList("users", sort, filters);
  }

  public async getUser(id: number) {
    return this.requestResource(`users/${id}`, "GET");
  }

  public async deleteUser(id: number) {
    return this.requestResource(`users/${id}`, "DELETE");
  }

  public async updateUser(id: number, data: any) {
    return this.requestResource(`users/${id}`, "PUT", undefined, data);
  }

  public async addUser(data: any) {
    return this.requestResource(`users`, "POST", undefined, data);
  }

  public async iterateOrders(sort?: any, filters?: string) {
    return this.iterateList("orders", sort, filters);
  }

  public async getOrder(id: number) {
    return this.requestResource(`orders/${id}`, "GET");
  }

  public async deleteOrder(id: number) {
    return this.requestResource(`order/${id}`, "DELETE");
  }

  public async updateOrder(id: number, data: any) {
    return this.requestResource(`orders/${id}`, "PUT", undefined, data);
  }

  public async addOrder(data: any) {
    return this.requestResource(`orders`, "POST", undefined, data);
  }

  public async iterateStatuses(sort?: any, filters?: string) {
    return this.iterateList("statuses", sort, filters);
  }

  public async getStatus(id: number) {
    return this.requestResource(`statuses/${id}`, "GET");
  }

  public async iterateProducts(sort?: any, filters?: string) {
    return this.iterateList("products", sort, filters);
  }

  public async getProduct(id: number) {
    return this.requestResource(`products/${id}`, "GET");
  }

  public async deleteProduct(id: number) {
    return this.requestResource(`products/${id}`, "DELETE");
  }

  public async updateProduct(id: number, data: any) {
    return this.requestResource(`products/${id}`, "PUT", undefined, data);
  }

  public async addProduct(data: any) {
    return this.requestResource(`products`, "POST", undefined, data);
  }

  private requestList(
    resource: string,
    limit: number = 50,
    page: number = 0,
    sort?: any,
    filters?: string
  ) {
    let paramObject: any = {
      limit,
      page
    };
    if (sort) {
      paramObject.order = sort;
    }
    if (filters) {
      paramObject.filters = filters;
    }
    return this.requestResource(`${resource}`, "GET", paramObject);
  }

  public async *iterateList(
    resource: string,
    sort?: any,
    filters?: string
  ): AsyncIterableIterator<any> {
    let currentPage = 0;
    while (true) {
      try {
        const data = await this.requestList(
          resource,
          50,
          currentPage,
          sort,
          filters
        );
        if (data.list.length < 1) {
          return;
        }
        for (const element of data.list) {
          yield element;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return;
        }
        throw error;
      }
      currentPage += 1;
    }
  }

  private async requestResource(
    path: string,
    method: string,
    params?: any,
    data?: any
  ) {
    if (this.shouldRefreshToken) {
      await this.refreshAccessToken();
    }
    const resp = await Request.request({
      url: `${this.endpoint}/${path}`,
      method: method as any,
      params,
      data,
      headers: {
        Authorization: `Bearer ${this.authToken!.accessToken}`
      }
    });
    return resp.data;
  }

  private get shouldRefreshToken() {
    // refresh token 5 minutes before expiration
    const expirationMargin = 60 * 5;
    return (
      !this.authToken ||
      this.authToken.date + this.authToken.expiresIn >
        Date.now() / 1000 - expirationMargin
    );
  }

  private async refreshAccessToken() {
    if (this.config.auth.method === AuthMethod.UserPassword) {
      try {
        const resp = await Request.post(
          `${this.endpoint}/auth`,
          {
            client_id: this.config.auth.username,
            client_secret: this.config.auth.password
          },
          {
            params: {
              client_id: this.config.auth.username,
              client_secret: this.config.auth.password
            }
          }
        );
        const responseToken = resp.data;
        this.authToken = {
          accessToken: responseToken.access_token,
          expiresIn: responseToken.expires_in,
          date: Date.now() / 1000
        };
      } catch (error) {
        throw new Error("Auth error");
      }
    } else if (this.config.auth.method === AuthMethod.Token) {
      this.authToken = {
        accessToken: this.config.auth.accessToken,
        expiresIn: 99999999,
        date: Date.now() / 1000
      };
    } else {
      throw new Error("Unknown auth method");
    }
  }
}
