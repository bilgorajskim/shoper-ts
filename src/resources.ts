type Narrowable =
  | string
  | number
  | boolean
  | symbol
  | object
  | null
  | undefined
  | void
  | ((...args: any[]) => any)
  | {};

const literally = <
  T extends { [k: string]: V | T } | Array<{ [k: string]: V | T }>,
  V extends Narrowable
>(
  t: T
) => t;

// Auto generated
export const shoper_resources = literally([
  {
    name: "aboutpages",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "additional-fields",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "application-config",
    methods: ["LIST"],
  },
  {
    name: "application-lock",
    methods: ["DELETE", "GET", "INSERT", "UPDATE"],
  },
  {
    name: "application-version",
    methods: ["LIST"],
  },
  {
    name: "attribute-groups",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "attributes",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "auction-houses",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "auction-orders",
    methods: ["GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "auctions",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "availabilities",
    methods: ["GET", "LIST"],
  },
  {
    name: "categories-tree",
    methods: ["GET", "LIST"],
  },
  {
    name: "categories",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "currencies",
    methods: ["GET", "LIST"],
  },
  {
    name: "dashboard-activities",
    methods: ["LIST"],
  },
  {
    name: "dashboard-stats",
    methods: ["GET"],
  },
  {
    name: "deliveries",
    methods: ["GET", "LIST"],
  },
  {
    name: "gauges",
    methods: ["GET", "LIST"],
  },
  {
    name: "geolocation-countries",
    methods: ["GET", "LIST"],
  },
  {
    name: "geolocation-regions",
    methods: ["GET", "LIST"],
  },
  {
    name: "geolocation-subregions",
    methods: ["GET", "LIST"],
  },
  {
    name: "languages",
    methods: ["GET", "LIST"],
  },
  {
    name: "metafield-values",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "metafields",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "news-categories",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "news-comments",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "news-files",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "news-tags",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "news",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "object-mtime",
    methods: ["GET"],
  },
  {
    name: "option-groups",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "option-values",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "options",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "order-products",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "orders",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "parcels",
    methods: ["GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "payments",
    methods: ["GET", "LIST"],
  },
  {
    name: "producers",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "product-files",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "product-images",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "product-stocks",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "products",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "progresses",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "promotion-codes",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "redirects",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "shippings",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "specialoffers",
    methods: ["DELETE", "GET", "LIST"],
  },
  {
    name: "statuses",
    methods: ["GET", "LIST"],
  },
  {
    name: "subscriber-groups",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "subscribers",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "taxes",
    methods: ["GET", "LIST"],
  },
  {
    name: "units",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "user-addresses",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "user-groups",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "users",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "webhooks",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
  {
    name: "zones",
    methods: ["DELETE", "GET", "INSERT", "LIST", "UPDATE"],
  },
]);
