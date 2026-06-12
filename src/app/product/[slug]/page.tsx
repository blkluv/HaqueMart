import { notFound } from "next/navigation";
import { getProduct } from "@/lib/graphql/products";
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

  let product;
  try {
    product = await getProduct(slug);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
        <p className="mt-2">Unable to load product. Please try again later.</p>
      </div>
    );
  }

  if (!product) notFound();

  // Safely extract price (handle string or number)
  const rawPrice = product.price ?? product.regularPrice ?? product.salePrice ?? "0";
  const numericPrice = typeof rawPrice === "number" ? rawPrice : parseFloat(String(rawPrice)) || 0;

  // Build cart item with safe defaults
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
      nodes: (product.productCategories?.nodes || []).map((cat) => ({
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
