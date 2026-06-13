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

import { toProductListItem } from "@/lib/products/mapper";

interface CategoriesResponse {
  productCategories: {
    nodes: Array<{
      name: string;
      slug: string;
      count: number;
    }>;
  };
}

export async function getProducts(opts: {
  first?: number;
  after?: string;
  category?: string;
} = {}) {
  const data = await wpgql<ProductsResponse>(GET_PRODUCTS, {
    first: opts.first ?? 100,
    after: opts.after ?? null,
    category: opts.category ?? null,
  });

  const nodes: ProductListItem[] = data.products.nodes.map((product) =>
    toProductListItem(product)
  );

  return {
    nodes,
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

export async function getProduct(
  slug: string
): Promise<Product | null> {
  try {
    const data = await wpgql<ProductResponse>(GET_PRODUCT, {
      slug,
    });

    if (!data.product) return null;

    const product: Product = {
      ...data.product,
      stockStatus: data.product.stockStatus ?? "IN_STOCK",
      stockQuantity: data.product.stockQuantity ?? 0,
      rating: Number(data.product.averageRating ?? 0),
      reviewCount: Number(data.product.reviewCount ?? 0),
    };

    return product;
  } catch (error) {
    console.error(`Error fetching product "${slug}":`, error);
    return null;
  }
}

export async function getCategories(): Promise<
  Array<{ name: string; slug: string }>
> {
  try {
    const data = await wpgql<CategoriesResponse>(GET_PRODUCT_CATEGORIES);

    return data.productCategories.nodes
      .filter((category) => category.count > 0)
      .map((category) => ({
        name: category.name,
        slug: category.slug,
      }));
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
}