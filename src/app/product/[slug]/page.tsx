import { notFound } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/ProductActions";
import type { StockStatus } from "@/types";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

// ✅ `params` is now a Promise, which is how Next.js App Router provides it
interface Props {
  params: Promise<{ slug: string }>;
}

const mapStockStatus = (status?: string): StockStatus => {
  switch ((status || "").toLowerCase()) {
    case "instock":
      return "IN_STOCK";
    case "onbackorder":
      return "ON_BACKORDER";
    default:
      return "OUT_OF_STOCK";
  }
};

export default async function ProductPage({ params }: Props) {
  // ✅ Await the params Promise before using its properties
  const { slug: rawSlug } = await params;

  if (!rawSlug) notFound();
  const slug = decodeURIComponent(rawSlug);

  const graphqlUrl =
    process.env.NEXT_PUBLIC_WP_GRAPHQL_URL ||
    process.env.WP_GRAPHQL_URL;

  if (!graphqlUrl) {
    throw new Error("Missing GraphQL endpoint environment variable");
  }

  // Build variables explicitly to guarantee they're sent
  const variables = { slug };

  const res = await fetch(graphqlUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query GetProduct($slug: ID!) {
          product(id: $slug, idType: SLUG) {
            databaseId
            name
            slug
            description
            averageRating
            reviewCount
            image {
              sourceUrl
              altText
            }
            productCategories {
              nodes {
                name
                slug
              }
            }
            ... on SimpleProduct {
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
            }
            ... on VariableProduct {
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
            }
          }
        }
      `,
      variables,
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const product = json?.data?.product;

  if (!product) notFound();

  const rawPrice =
    product.price ??
    product.regularPrice ??
    product.salePrice ??
    "0";

  const numericPrice =
    typeof rawPrice === "number"
      ? rawPrice
      : parseFloat(String(rawPrice).match(/\d+(\.\d+)?/)?.[0] || "0");

  const cartItem = {
    productId: product.databaseId,
    databaseId: product.databaseId,
    name: product.name,
    slug: product.slug,

    price: numericPrice,
    priceFormatted: formatPrice(numericPrice),

    regularPrice: product.regularPrice ?? null,
    salePrice: product.salePrice ?? null,

    stockStatus: mapStockStatus(product.stockStatus),
    stockCount: product.stockQuantity ?? 0,

    image: {
      sourceUrl: product.image?.sourceUrl || "/placeholder.jpg",
      altText: product.image?.altText || product.name,
    },

    productCategories: {
      nodes: (product.productCategories?.nodes || []).map(
        (c: { name: string; slug: string }) => ({
          name: c.name,
          slug: c.slug,
        })
      ),
    },

    rating: Number(product.averageRating ?? 0),
    reviewCount: Number(product.reviewCount ?? 0),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {product.image?.sourceUrl ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-2xl font-semibold text-primary">
            {formatPrice(numericPrice)}
          </p>

          {product.description && (
            <div
              className="prose text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
          )}

          <ProductActions item={cartItem} />
        </div>
      </div>
    </div>
  );
}