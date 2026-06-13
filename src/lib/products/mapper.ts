import type { Product, ProductListItem } from "@/types";

/**
 * Normalize raw GraphQL product → UI ProductListItem
 * Fully explicit mapping = safest approach
 */
export function toProductListItem(product: Product): ProductListItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,

    price: product.price,
    regularPrice: product.regularPrice,
    salePrice: product.salePrice,

    image: product.image,

    stockStatus: product.stockStatus ?? "IN_STOCK",
    stockCount: product.stockQuantity ?? 0,

    rating: Number(product.averageRating ?? 0),
    reviewCount: Number(product.reviewCount ?? 0),

    // include anything else your UI needs explicitly
  };
}