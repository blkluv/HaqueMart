import { wpgql } from "./client";
import {
  GET_PRODUCTS,
  GET_PRODUCT,
  GET_PRODUCT_CATEGORIES,
} from "./queries";
import type {
  ProductsResponse,
  ProductResponse,
  Product,
  ProductListItem,
} from "@/types";

interface CategoriesResponse {
  productCategories: {
    nodes: Array<{ name: string; slug: string; count: number }>;
  };
}

export async function getProducts(opts: {
  first?: number;
  after?: string;
  category?: string;
} = {}): Promise<{
  nodes: ProductListItem[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  const data = await wpgql<ProductsResponse>(GET_PRODUCTS, {
    first: opts.first ?? 12,
    after: opts.after ?? null,
    category: opts.category ?? null,
  });

  return {
    nodes: data.products.nodes,
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const data = await wpgql<ProductResponse>(GET_PRODUCT, { slug });
    return data.product ?? null;
  } catch (error) {
    console.error(`Error fetching product with slug "${slug}":`, error);
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const data = await wpgql<CategoriesResponse>(GET_PRODUCT_CATEGORIES);
    return data.productCategories.nodes
      .filter((c) => c.count > 0)
      .map((c) => c.name);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
