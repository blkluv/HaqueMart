// app/product/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/ProductActions";

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ProductPage({ params }: Props) {
  // Handle both Next.js 15 (Promise) and 13/14 (plain object)
  const slug = "then" in params ? (await params).slug : params.slug;

  if (!slug || slug === "undefined") notFound();

  let product = null;
  let errorMsg = null;

  const graphqlUrl = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || process.env.WP_GRAPHQL_URL;

  if (!graphqlUrl) {
    errorMsg = "Missing GraphQL endpoint environment variable";
  } else {
    try {
      const res = await fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetProduct($slug: String!) {
                product(id: $slug, idType: SLUG) {
                databaseId
                name
                slug
                description
                price
                regularPrice
                salePrice
                stockStatus
                stockQuantity
                averageRating
                reviewCount
                soldThisWeek
                badge
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
              }
            }
          `,
          variables: { slug },
        }),
        next: { revalidate: 60 },
      });

      const json = await res.json();

      if (json.errors) {
        errorMsg = json.errors[0].message;
      } else if (!json.data?.product) {
        errorMsg = "Product not found";
      } else {
        product = json.data.product;
      }
    } catch (err: any) {
      errorMsg = err.message;
    }
  }

  // Show error clearly if something failed
  if (errorMsg) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{errorMsg}</pre>
          <p className="mt-4 text-sm">
            Check your GraphQL endpoint and that the product slug "{slug}" exists.
          </p>
        </div>
      </div>
    );
  }

  if (!product) notFound();

  // Safely extract price
  const rawPrice = product.price ?? product.regularPrice ?? product.salePrice ?? "0";
  const numericPrice = typeof rawPrice === "number" ? rawPrice : parseFloat(String(rawPrice)) || 0;

  // Build cart item
  const cartItem = {
    productId: product.databaseId,
    databaseId: product.databaseId,
    name: product.name || "Unnamed Product",
    slug: product.slug,
    price: numericPrice,
    priceFormatted: formatPrice(numericPrice),
    regularPrice: product.regularPrice ?? null,
    salePrice: product.salePrice ?? null,
    stockStatus: product.stockStatus || "IN_STOCK",
    stockCount: product.stockQuantity ?? 0,
    image: {
      sourceUrl: product.image?.sourceUrl || "/placeholder.jpg",
      altText: product.image?.altText || product.name || "Product image",
    },
    productCategories: {
      nodes: (product.productCategories?.nodes || []).map((cat: any) => ({
        name: cat.name,
        slug: cat.slug,
      })),
    },
    rating: product.averageRating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    soldThisWeek: product.soldThisWeek ?? 0,
    badge: product.badge ?? undefined,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
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

        {/* Product Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name || "Product"}</h1>
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
