import { wpRest } from "./client";
import type { ProductListItem } from "@/types";

export async function getRestProducts(): Promise<ProductListItem[]> {
  const data = await wpRest<any[]>("/wp/v2/product?per_page=12");

  return data.map((p) => ({
    id: String(p.id),
    databaseId: p.id,
    name: p.title.rendered,
    slug: p.slug,
    price: p.price ?? "",
    regularPrice: "",
    salePrice: null,
    stockStatus: "IN_STOCK",
    image: {
      sourceUrl: p.featured_media_url ?? "",
      altText: p.title.rendered,
    },
    productCategories: {
      nodes: [],
    },
    rating: 0,
    reviewCount: 0,
    soldThisWeek: 0,
    stockCount: 0,
  }));
}
