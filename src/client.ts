import Request from "./request";

export enum AuthMethod {
  UserPassword
}

export type UserPasswordAuth = {
  method: AuthMethod.UserPassword;
  username: string;
  password: string;
};

export type ClientConfig = {
  auth: UserPasswordAuth;
  shopUrl: string;
};

export type AuthToken = {
  accessToken: string;
  // Token creation date, timestamp in seconds
  date: number;
  // How many seconds it will live
  expiresIn: number;
  tokenType: string;
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

  public iterateUsers(sort?: any, filters?: string) {
    return this.iterateList("users", sort, filters);
  }

  public getUser(id: number) {
    return this.requestResource(`users/${id}`, "GET");
  }

  public updateUser(id: number, data: any) {
    return this.requestResource(`users/${id}`, "POST", undefined, data);
  }

  public iterateOrders(sort?: any, filters?: string) {
    return this.iterateList("orders", sort, filters);
  }

  public getOrder(id: number) {
    return this.requestResource(`orders/${id}`, "GET");
  }

  public updateOrder(id: number, data: any) {
    return this.requestResource(`orders/${id}`, "POST", undefined, data);
  }

  public iterateStatuses(sort?: any, filters?: string) {
    return this.iterateList("statuses", sort, filters);
  }

  public getStatus(id: number) {
    return this.requestResource(`statuses/${id}`, "GET");
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
    try {
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
    } catch (error) {
      throw error;
    }
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
          tokenType: responseToken.token_type,
          date: Date.now() / 1000
        };
      } catch (error) {
        throw new Error("Auth error");
      }
    } else {
      throw new Error("Unknown auth method");
    }
  }
}
