// ── WPGraphQL / WooCommerce shapes ────────────────────────────────────────────

export interface WPImage {
  sourceUrl: string;
  altText: string;
}

export interface ProductCategory {
  name: string;
  slug: string;
}

export type StockStatus =
  | "IN_STOCK"
  | "OUT_OF_STOCK"
  | "ON_BACKORDER";

// ── Base Product Core (shared raw shape) ──────────────────────────────────────

interface ProductCore {
  id: string;
  databaseId: number;

  name: string;
  slug: string;

  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;

  stockStatus: StockStatus;

  stockQuantity?: number | null;

  averageRating?: number;
  reviewCount?: number;

  image: WPImage | null;

  productCategories: {
    nodes: ProductCategory[];
  };
}

// ── UI / Listing Model ────────────────────────────────────────────────────────

/** Minimal product shape used in listing grids */
export interface ProductListItem extends ProductCore {
  // normalized UI fields
  rating: number;
  reviewCount: number;

  stockCount: number;

  soldThisWeek?: number;

  badge?: "best-seller" | "trending" | "new";
}

// ── Full Product Detail Model ─────────────────────────────────────────────────

export interface Product extends ProductCore {
  description: string;
  shortDescription: string;

  stockQuantity: number | null;

  galleryImages: {
    nodes: WPImage[];
  };

  // UI computed fields (optional on detail page)
  rating: number;
  reviewCount: number;

  soldThisWeek?: number;
  viewingSeed?: number;

  reviews?: MockReview[];
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface MockReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
  verified?: boolean;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  databaseId: number;

  name: string;
  slug: string;

  price: number;
  priceFormatted: string;

  regularPrice: string | null;
  salePrice: string | null;

  stockStatus: StockStatus;
  stockCount?: number;

  image: WPImage | null;

  productCategories: {
    nodes: ProductCategory[];
  };

  rating?: number;
  reviewCount?: number;
  soldThisWeek?: number;
  badge?: string;

  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ── GraphQL Response Wrappers ────────────────────────────────────────────────

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ProductsResponse {
  products: {
    nodes: Product[];
    pageInfo: PageInfo;
  };
}

export interface ProductResponse {
  product: Product | null;
}