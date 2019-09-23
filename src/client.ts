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

  public iterateUsers(sort?: any, filters?: object) {
    return this.iterateList("users", sort, filters);
  }

  public getUser(id: number) {
    return this.requestResource(`users/${id}`, "GET");
  }

  public deleteUser(id: number) {
    return this.requestResource(`users/${id}`, "DELETE");
  }

  public updateUser(id: number, data: any) {
    return this.requestResource(`users/${id}`, "PUT", undefined, data);
  }

  public addUser(data: any) {
    return this.requestResource(`users`, "POST", undefined, data);
  }

  public iterateOrders(sort?: any, filters?: object) {
    return this.iterateList("orders", sort, filters);
  }

  public getOrder(id: number) {
    return this.requestResource(`orders/${id}`, "GET");
  }

  public deleteOrder(id: number) {
    return this.requestResource(`order/${id}`, "DELETE");
  }

  public updateOrder(id: number, data: any) {
    return this.requestResource(`orders/${id}`, "PUT", undefined, data);
  }

  public addOrder(data: any) {
    return this.requestResource(`orders`, "POST", undefined, data);
  }

  public iterateOrderProducts(sort?: any, filters?: object) {
    return this.iterateList("order-products", sort, filters);
  }

  public getOrderProduct(id: number) {
    return this.requestResource(`order-products/${id}`, "GET");
  }

  public deleteOrderProduct(id: number) {
    return this.requestResource(`order-products/${id}`, "DELETE");
  }

  public updateOrderProduct(id: number, data: any) {
    return this.requestResource(`order-products/${id}`, "PUT", undefined, data);
  }

  public addOrderProduct(data: any) {
    return this.requestResource(`order-products`, "POST", undefined, data);
  }

  public iterateProducts(sort?: any, filters?: object) {
    return this.iterateList("products", sort, filters);
  }

  public getProduct(id: number) {
    return this.requestResource(`products/${id}`, "GET");
  }

  public deleteProduct(id: number) {
    return this.requestResource(`products/${id}`, "DELETE");
  }

  public updateProduct(id: number, data: any) {
    return this.requestResource(`products/${id}`, "PUT", undefined, data);
  }

  public addProduct(data: any) {
    return this.requestResource(`products`, "POST", undefined, data);
  }

  public iterateProductStocks(sort?: any, filters?: object) {
    return this.iterateList("product-stocks", sort, filters);
  }

  public getProductStock(id: number) {
    return this.requestResource(`product-stocks/${id}`, "GET");
  }

  public deleteProductStock(id: number) {
    return this.requestResource(`product-stocks/${id}`, "DELETE");
  }

  public updateProductStock(id: number, data: any) {
    return this.requestResource(`product-stocks/${id}`, "PUT", undefined, data);
  }

  public addProductStock(data: any) {
    return this.requestResource(`product-stocks`, "POST", undefined, data);
  }

  public iterateProductImages(sort?: any, filters?: object) {
    return this.iterateList("product-images", sort, filters);
  }

  public getProductImage(id: number) {
    return this.requestResource(`product-images/${id}`, "GET");
  }

  public deleteProductImage(id: number) {
    return this.requestResource(`product-images/${id}`, "DELETE");
  }

  public updateProductImage(id: number, data: any) {
    return this.requestResource(`product-images/${id}`, "PUT", undefined, data);
  }

  public addProductImage(data: any) {
    return this.requestResource(`product-images`, "POST", undefined, data);
  }

  public iterateProductFiles(sort?: any, filters?: object) {
    return this.iterateList("product-files", sort, filters);
  }

  public getProductFile(id: number) {
    return this.requestResource(`product-files/${id}`, "GET");
  }

  public deleteProductFile(id: number) {
    return this.requestResource(`product-files/${id}`, "DELETE");
  }

  public updateProductFile(id: number, data: any) {
    return this.requestResource(`product-files/${id}`, "PUT", undefined, data);
  }

  public addProductFile(data: any) {
    return this.requestResource(`product-files`, "POST", undefined, data);
  }

  public iterateCategories(sort?: any, filters?: object) {
    return this.iterateList("categories", sort, filters);
  }

  public getCategory(id: number) {
    return this.requestResource(`categories/${id}`, "GET");
  }

  public deleteCategory(id: number) {
    return this.requestResource(`categories/${id}`, "DELETE");
  }

  public updateCategory(id: number, data: any) {
    return this.requestResource(`categories/${id}`, "PUT", undefined, data);
  }

  public addCategory(data: any) {
    return this.requestResource(`categories`, "POST", undefined, data);
  }

  public iterateProducers(sort?: any, filters?: object) {
    return this.iterateList("producers", sort, filters);
  }

  public getProducer(id: number) {
    return this.requestResource(`producers/${id}`, "GET");
  }

  public deleteProducer(id: number) {
    return this.requestResource(`producers/${id}`, "DELETE");
  }

  public updateProducer(id: number, data: any) {
    return this.requestResource(`producers/${id}`, "PUT", undefined, data);
  }

  public addProducer(data: any) {
    return this.requestResource(`producers`, "POST", undefined, data);
  }

  public iterateAttributes(sort?: any, filters?: object) {
    return this.iterateList("attributes", sort, filters);
  }

  public getAttribute(id: number) {
    return this.requestResource(`attributes/${id}`, "GET");
  }

  public deleteAttribute(id: number) {
    return this.requestResource(`attributes/${id}`, "DELETE");
  }

  public updateAttribute(id: number, data: any) {
    return this.requestResource(`attributes/${id}`, "PUT", undefined, data);
  }

  public addAttribute(data: any) {
    return this.requestResource(`attributes`, "POST", undefined, data);
  }

  public iterateAttributeGroups(sort?: any, filters?: object) {
    return this.iterateList("attribute-groups", sort, filters);
  }

  public getAttributeGroup(id: number) {
    return this.requestResource(`attribute-groups/${id}`, "GET");
  }

  public deleteAttributeGroup(id: number) {
    return this.requestResource(`attribute-groups/${id}`, "DELETE");
  }

  public updateAttributeGroup(id: number, data: any) {
    return this.requestResource(
      `attribute-groups/${id}`,
      "PUT",
      undefined,
      data
    );
  }

  public addAttributeGroup(data: any) {
    return this.requestResource(`attribute-groups`, "POST", undefined, data);
  }

  public iterateUserAddresses(sort?: any, filters?: object) {
    return this.iterateList("user-addresses", sort, filters);
  }

  public getUserAddress(id: number) {
    return this.requestResource(`user-addresses/${id}`, "GET");
  }

  public deleteUserAddress(id: number) {
    return this.requestResource(`user-addresses/${id}`, "DELETE");
  }

  public updateUserAddress(id: number, data: any) {
    return this.requestResource(`user-addresses/${id}`, "PUT", undefined, data);
  }

  public addUserAddress(data: any) {
    return this.requestResource(`user-addresses`, "POST", undefined, data);
  }

  public iterateParcels(sort?: any, filters?: object) {
    return this.iterateList("parcels", sort, filters);
  }

  public getParcel(id: number) {
    return this.requestResource(`parcels/${id}`, "GET");
  }

  public deleteParcel(id: number) {
    return this.requestResource(`parcels/${id}`, "DELETE");
  }

  public updateParcel(id: number, data: any) {
    return this.requestResource(`parcels/${id}`, "PUT", undefined, data);
  }

  public addParcel(data: any) {
    return this.requestResource(`parcels`, "POST", undefined, data);
  }

  public iterateStatuses(sort?: any, filters?: object) {
    return this.iterateList("statuses", sort, filters);
  }

  public getStatus(id: number) {
    return this.requestResource(`statuses/${id}`, "GET");
  }

  public iterateTaxes(sort?: any, filters?: object) {
    return this.iterateList("taxes", sort, filters);
  }

  public getTax(id: number) {
    return this.requestResource(`taxes/${id}`, "GET");
  }

  public iterateCurrencies(sort?: any, filters?: object) {
    return this.iterateList("currencies", sort, filters);
  }

  public getCurrency(id: number) {
    return this.requestResource(`currencies/${id}`, "GET");
  }

  public iterateLanguages(sort?: any, filters?: object) {
    return this.iterateList("languages", sort, filters);
  }

  public getLanguage(id: number) {
    return this.requestResource(`languages/${id}`, "GET");
  }

  public getCategoriesTree() {
    return this.requestResource(`categories-tree`, "GET");
  }

  public getCategoriesSubtree(id: number) {
    return this.requestResource(`categories-tree/${id}`, "GET");
  }

  private requestList(
    resource: string,
    limit: number = 50,
    page: number = 0,
    sort?: any,
    filters?: object
  ) {
    let paramObject: any = {
      limit,
      offset: limit * page
    };
    if (sort) {
      paramObject.order = sort;
    }
    if (filters) {
      paramObject.filters = JSON.stringify(filters);
    }
    return this.requestResource(`${resource}`, "GET", paramObject);
  }

  public async *iterateList(
    resource: string,
    sort?: any,
    filters?: object
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

  public async bulk(data: any) {
    if (this.shouldRefreshToken) {
      await this.refreshAccessToken();
    }
    try {
      const resp = await Request.request({
        url: `${this.endpoint}/bulk`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${this.authToken!.accessToken}`
        },
        validateStatus: function(status: number) {
          return status === 404 || (status >= 200 && status < 300);
        }
      });
      return resp.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      } else {
        throw error;
      }
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
      if (error.response && error.response.status === 404) {
        return null;
      } else {
        throw error;
      }
    }
  }

  private get shouldRefreshToken() {
    // refresh token 15 minutes before expiration
    const expirationMargin = 60 * 15;
    return (
      !this.authToken ||
      Date.now() / 1000 - expirationMargin >
        this.authToken.date + this.authToken.expiresIn
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
        error.message = "Auth error";
        throw error;
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
