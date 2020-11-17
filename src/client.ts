import { LeakyBucket } from "ts-leaky-bucket";
import Request from "./request";
import { shoper_resources } from "./resources";

export enum AuthMethod {
  UserPassword,
  Token,
}

export type UserPasswordAuth = {
  method: AuthMethod.UserPassword;
  username: string;
  password: string;
};

export type TokenAuth = {
  method: AuthMethod.Token;
  access_token: string;
  refresh_token: string;
};

export type ClientConfig = {
  auth: UserPasswordAuth | TokenAuth;
  shop_url: string;
};

export type auth_token = {
  access_token: string;
  // Token creation date, timestamp in seconds
  date: number;
  // How many seconds it will live
  expires_in: number;
};

export type ShoperResourceMethod =
  | "DELETE"
  | "GET"
  | "INSERT"
  | "LIST"
  | "UPDATE";

type ShoperResource = typeof shoper_resources[number]["name"];

/*
  Some resources are labeled in Shoper documentation as
  having "LIST" method. However, they don't behave like
  other lists. They don't accept an offset, and the response
  isn't wrapped in a pagination object. 
*/
const list_resources_that_are_not_lists = [
  "categories-tree",
  "application-config",
  "application-version",
  "dashboard-activities",
  "object-mtime",
];

function validate_resource_call(
  resource: ShoperResource,
  method: ShoperResourceMethod
) {
  const resource_info = shoper_resources.find((r) => r.name === resource);
  if (!resource_info) {
    const resource_names = shoper_resources.map((r) => r.name);
    throw new Error(
      `Unrecognized resource: "${resource}". Supported resources: ${resource_names.join(
        ", "
      )}`
    );
  }
  const resource_methods: ShoperResourceMethod[] = resource_info.methods;
  if (!resource_methods.includes(method)) {
    if (
      method === "LIST" &&
      list_resources_that_are_not_lists.includes(resource)
    ) {
      return true;
    }
    throw new Error(`Resource "${resource}" cannot be called with ${method}`);
  }
  return true;
}

// Refill rate is 2 items per second.
const bucket = new LeakyBucket({
  capacity: 10,
  intervalMillis: 5_000,
  additionalTimeoutMillis: 0, // no timeout
});

type ShoperListOptions = {
  sort?: any;
  filters?: object;
};

export class Client {
  private config: ClientConfig;
  private auth_token?: auth_token;
  private endpoint: string;

  constructor(config: ClientConfig) {
    this.config = config;
    // Remove trailing slash(es)
    this.config.shop_url = this.config.shop_url.replace(/\/+$/, "");
    this.endpoint = `${this.config.shop_url}/webapi/rest`;
  }

  public delete(resource: ShoperResource, id: number) {
    validate_resource_call(resource, "DELETE");
    return this.request_resource(`${resource}/${id}`, "DELETE");
  }

  public get(resource: ShoperResource, id?: number, params?: any) {
    validate_resource_call(resource, "GET");

    if (!id && !list_resources_that_are_not_lists.includes(resource)) {
      throw new Error(`Cannot GET resource "${resource}" without an ID.`);
    }

    return this.request_resource(
      id ? `${resource}/${id}` : resource,
      "GET",
      params
    );
  }

  public insert(resource: ShoperResource, data: any) {
    validate_resource_call(resource, "INSERT");
    return this.request_resource(resource, "POST", undefined, data);
  }

  /**
   * Returns an async generator that yields successive items.
   * @param resource resource name
   */
  public iterate(resource: ShoperResource, options?: ShoperListOptions) {
    validate_resource_call(resource, "LIST");
    if (list_resources_that_are_not_lists.includes(resource)) {
      throw new Error(`Resource ${resource} cannot be iterated.`);
    }
    return this.iterate_list(resource, options);
  }

  /**
   * Returns all matching items.
   */
  public async list(resource: ShoperResource, options?: ShoperListOptions) {
    validate_resource_call(resource, "LIST");
    const data = [];
    for await (const item of this.iterate_list(resource, options)) {
      data.push(item);
    }
    return data;
  }

  public update(resource: ShoperResource, id: number, data: any) {
    validate_resource_call(resource, "UPDATE");
    return this.request_resource(`${resource}/${id}`, "PUT", undefined, data);
  }

  private request_list(
    resource: string,
    limit: number = 50,
    page: number = 0,
    sort?: any,
    filters?: object
  ) {
    let param_object: any = {
      limit,
      offset: limit * page,
    };
    if (sort) {
      param_object.order = sort;
    }
    if (filters) {
      param_object.filters = JSON.stringify(filters);
    }
    return this.request_resource(resource, "GET", param_object);
  }

  public async *iterate_list(
    resource: string,
    options?: ShoperListOptions
  ): AsyncIterableIterator<any> {
    let currentPage = 0;
    while (true) {
      try {
        const data = await this.request_list(
          resource,
          50,
          currentPage,
          options ? options.sort : undefined,
          options ? options.filters : undefined
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

  public async bulk(data: any): Promise<any> {
    await bucket.maybeThrottle();
    if (this.should_refresh_token) {
      await this.refresh_access_token();
    }
    try {
      const resp = await Request.request({
        url: `${this.endpoint}/bulk`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${this.auth_token!.access_token}`,
        },
        validateStatus: function (status: number) {
          return status === 404 || (status >= 200 && status < 300);
        },
      });
      return resp.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return null;
        } else if (error.response.status === 429) {
          // Exceeded request limit. Wait and repeat request.
          bucket.pauseByCost(1);
          return await this.bulk(data);
        }
      } else {
        throw error;
      }
    }
  }

  private async request_resource(
    path: string,
    method: string,
    params?: any,
    data?: any
  ): Promise<any> {
    await bucket.maybeThrottle();
    if (this.should_refresh_token) {
      await this.refresh_access_token();
    }
    try {
      const resp = await Request.request({
        url: `${this.endpoint}/${path}`,
        method: method as any,
        params,
        data,
        headers: {
          Authorization: `Bearer ${this.auth_token!.access_token}`,
        },
      });
      return resp.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return null;
        } else if (error.response.status === 429) {
          // Exceeded request limit. Wait and repeat request.
          bucket.pauseByCost(1);
          return await this.request_resource(path, method, params, data);
        }
      } else {
        throw error;
      }
    }
  }

  private get should_refresh_token() {
    // refresh token 15 minutes before expiration
    const expiration_margin = 60 * 15;
    return (
      !this.auth_token ||
      Date.now() / 1000 - expiration_margin >
        this.auth_token.date + this.auth_token.expires_in
    );
  }

  private async refresh_access_token() {
    if (this.config.auth.method === AuthMethod.UserPassword) {
      try {
        const resp = await Request.post(
          `${this.endpoint}/auth`,
          {
            client_id: this.config.auth.username,
            client_secret: this.config.auth.password,
          },
          {
            params: {
              client_id: this.config.auth.username,
              client_secret: this.config.auth.password,
            },
          }
        );
        const response_token = resp.data;
        this.auth_token = {
          access_token: response_token.access_token,
          expires_in: response_token.expires_in,
          date: Date.now() / 1000,
        };
      } catch (error) {
        error.message = "Auth error";
        throw error;
      }
    } else if (this.config.auth.method === AuthMethod.Token) {
      this.auth_token = {
        access_token: this.config.auth.access_token,
        expires_in: 99999999,
        date: Date.now() / 1000,
      };
      // TODO implement refreshing access token
    } else {
      throw new Error("Unknown auth method");
    }
  }
}
