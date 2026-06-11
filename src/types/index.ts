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

/** Minimal product shape used in listing grids */
export interface ProductListItem {
  id: string;
  databaseId: number;
  name: string;
  slug: string;

  /** WooCommerce formatted price string, e.g. "$29.99" */
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;

  stockStatus: StockStatus;

  image: WPImage | null;
  productCategories: { nodes: ProductCategory[] };

  // ── optional UX / marketing fields ─────────────────────────────────────────
  rating?: number;
  reviewCount?: number;
  soldThisWeek?: number;
  stockCount?: number;
  badge?: "best-seller" | "trending" | "new";
}

/** Full product shape used on product detail page */
export interface Product extends ProductListItem {
  description: string;
  shortDescription: string;

  stockQuantity: number | null;
  galleryImages: { nodes: WPImage[] };

  reviews?: MockReview[];
  viewingSeed?: number;
}
