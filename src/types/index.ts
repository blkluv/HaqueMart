// ── WPGraphQL / WooCommerce shapes ────────────────────────────────────────────

export interface WPImage {
  sourceUrl: string;
  altText: string;
}

export interface ProductCategory {
  name: string;
  slug: string;
}

/** Minimal product shape used in listing grids */
export interface ProductListItem {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  /** Formatted price string from WooCommerce, e.g. "$29.99" */
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
  image: WPImage | null;
  productCategories: { nodes: ProductCategory[] };
  // ── FOMO / social-proof fields (populated from mock data or custom meta) ──
  rating?: number;
  reviewCount?: number;
  soldThisWeek?: number;
  stockCount?: number;
  badge?: "best-seller" | "trending" | "new";
}

/** Full product shape used on the detail page */
export interface Product extends ProductListItem {
  description: string;
  shortDescription: string;
  stockQuantity: number | null;
  galleryImages: { nodes: WPImage[] };
  reviews?: MockReview[];
  viewingSeed?: number;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ProductsResponse {
  products: {
    pageInfo: PageInfo;
    nodes: ProductListItem[];
  };
}

export interface ProductResponse {
  product: Product | null;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  /** Numeric price for calculations, e.g. 29.99 */
  price: number;
  /** Display string, e.g. "$29.99" */
  priceFormatted: string;
  quantity: number;
  image: WPImage | null;
}

export interface Cart {
  items: CartItem[];
  /** Sum of (price × qty) for all items */
  total: number;
  /** Total number of units across all line items */
  itemCount: number;
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface MockReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
  verified: boolean;
}
