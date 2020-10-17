# Shoper REST API Typescript client

## Supported resources

This client supports all resources listed in Shoper REST API docs (at the time of writing). The API exposes some [additional resources](https://github.com/dreamcommerce/shop-appstore-lib/commit/0c6d308d0075f797a3d938a2b2642081bf79cf50), but because they are undocumented, this client doesn't support them.

## Development

You can generate a fresh list of resources to be pasted into `src/resources.ts` using `generate-resources.js` script. Go to Shoper REST API docs, open your browser's dev tools, inspect the `ul` element `REST API -> Resources`, and execute the script in the console.
