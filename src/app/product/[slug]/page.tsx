import { notFound } from "next/navigation";
import { getProduct } from "@/lib/graphql/products";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/ProductActions";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  if (!slug || slug === "undefined") notFound();

  const product = await getProduct(slug);
  if (!product) notFound();

  const numericPrice = parseFloat(product.price ?? "0") || 0;

  // Build cart item with correct types
  const cartItem = {
    productId: product.databaseId,
    databaseId: product.databaseId,
    name: product.name,
    slug: product.slug,
    price: numericPrice,
    priceFormatted: formatPrice(numericPrice),

    // Keep as strings (or null) – no parsing
    regularPrice: (product as any).regularPrice ?? null,
    salePrice: (product as any).salePrice ?? null,

    stockStatus: (product as any).stockStatus || "IN_STOCK",
    stockCount: (product as any).stockQuantity ?? 0,

    image: {
      sourceUrl: product.image?.sourceUrl || "/placeholder.jpg",
      altText: product.image?.altText || product.name,
    },

    productCategories: {
      nodes:
        product.productCategories?.nodes.map((cat) => ({
          name: cat.name,
          slug: cat.slug,
        })) ?? [],
    },

    rating: (product as any).averageRating ?? 0,
    reviewCount: (product as any).reviewCount ?? 0,
    soldThisWeek: (product as any).soldThisWeek ?? 0,
    badge: (product as any).badge ?? undefined, // or undefined to match string | undefined
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {product.image ? (
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
          <div
            className="prose text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />
          <ProductActions item={cartItem} />
        </div>
      </div>
    </div>
  );
}
