// app/product/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/ProductActions";
import type { StockStatus } from "@/types";

interface Props {
  params: { slug: string };
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
  const slug = params.slug;

  if (!slug || slug === "undefined") notFound();

  const graphqlUrl =
    process.env.NEXT_PUBLIC_WP_GRAPHQL_URL ||
    process.env.WP_GRAPHQL_URL;

  if (!graphqlUrl) notFound();

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
            stockQuantity
            stockStatus
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
            }
            ... on VariableProduct {
              price
              regularPrice
              salePrice
            }
            ... on ExternalProduct {
              price
              regularPrice
            }
            ... on GroupProduct {
              price
            }
          }
        }
      `,
      variables: { slug },
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();

  const product = json?.data?.product;

  if (!product) notFound();

  const rawPrice =
    product.price ??
    product.regularPrice ??
    product.salePrice ??
    "0";

  let numericPrice = 0;

  if (typeof rawPrice === "number") {
    numericPrice = rawPrice;
  } else {
    const match = String(rawPrice).match(/\d+(?:\.\d+)?/);
    numericPrice = match ? parseFloat(match[0]) : 0;
  }

  const cartItem = {
    productId: product.databaseId,
    databaseId: product.databaseId,
    name: product.name || "Unnamed Product",
    slug: product.slug,

    price: numericPrice,
    priceFormatted: formatPrice(numericPrice),
    regularPrice: product.regularPrice ?? null,
    salePrice: product.salePrice ?? null,

    stockStatus: mapStockStatus(product.stockStatus),

    stockCount: product.stockQuantity ?? 0,

    image: {
      sourceUrl: product.image?.sourceUrl || "/placeholder.jpg",
      altText: product.image?.altText || product.name || "Product image",
    },

    productCategories: {
      nodes: (product.productCategories?.nodes || []).map(
        (cat: { name: string; slug: string }) => ({
          name: cat.name,
          slug: cat.slug,
        })
      ),
    },

    rating: product.averageRating ?? 0,
    reviewCount: product.reviewCount ?? 0,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {product.image?.sourceUrl ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name || "Product"}
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
          <h1 className="text-3xl font-bold">
            {product.name || "Product"}
          </h1>

          <p className="text-2xl font-semibold text-primary">
            {formatPrice(numericPrice)}
          </p>

          {product.description && (
            <div
              className="prose text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          <ProductActions item={cartItem} />
        </div>
      </div>
    </div>
  );
}