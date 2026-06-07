import type { MetadataRoute } from "next";
import { isWpConfigured } from "@/lib/graphql/client";
import { getProducts } from "@/lib/graphql/products";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://campcreekmarket.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: string[] = [];

  if (isWpConfigured()) {
    try {
      const { nodes } = await getProducts({ first: 100 });
      slugs = nodes.map((p) => p.slug);
    } catch {
      slugs = MOCK_PRODUCTS.map((p) => p.slug);
    }
  } else {
    slugs = MOCK_PRODUCTS.map((p) => p.slug);
  }

  const productEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    ...productEntries,
  ];
}
