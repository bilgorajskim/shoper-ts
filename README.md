# Shoper REST API TypeScript client

## Installation

```bash
npm i shoper-ts
```

## Example

```ts
import { Client, AuthMethod } from "shoper-ts";

const shoper_client = new Client({
  shop_url: "https://sklep9999999.shoparena.pl",
  auth: {
    method: AuthMethod.UserPassword,
    username: "user-with-api-access",
    password: "pass",
  },
});

// Get a single product
const single_[roduct = await shoper_client.get("products", 123);

// Get all products
const all_products = await shoper_client.list("products");

// Update product
await shoper_client.update("products", 123, {
  translations: {
    "pl_PL": {
      name: "Foo Bar Deluxe"
    }
  }
});

// Insert product
await shoper_client.insert("products", {
  category_id: 1,
  translations: {
    "pl_PL": {
      name: "Foo Bar Deluxe",
      active: true
    }
  }
  // more fields go here...
});

// Lazily iterate products with stock level >= 10, sorted from latest to oldest
for await (const product of shoper_client.iterate("products", {
  sort: "edit_date desc",
  filters: {
    "stock.stock": {
      ">=": 10,
    },
  },
})) {
  console.log(product);
  if (some_condition) {
    break; // you can stop iterating at any time
  }
}

// Get categories tree
const categories_tree = await shoper_client.get("categories-tree");
```

## Supported resources

This client supports all resources listed in Shoper REST API docs (at the time of writing). The API exposes some [additional resources](https://github.com/dreamcommerce/shop-appstore-lib/commit/0c6d308d0075f797a3d938a2b2642081bf79cf50), but because they are undocumented, this client doesn't support them.

## Type checking

The client currently only checks if you are calling a valid resource/method. Only resource names are typed, otherwise everything you pass to or receive from is of `any` type.
See [official REST API docs](https://developers.shoper.pl/developers/api/resources) for examples and resource schemas.

## Development

You can generate a fresh list of resources to be pasted into `src/resources.ts` using `generate-resources.js` script. Go to Shoper REST API docs, open your browser's dev tools, inspect the `ul` element `REST API -> Resources`, and execute the script in the console.
