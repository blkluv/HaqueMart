import { notFound } from "next/navigation";
import { getProduct } from "@/lib/graphql/products";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/ProductActions";   // 👈 import

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  if (!slug || slug === "undefined") notFound();

  const product = await getProduct(slug);
  if (!product) notFound();

  // Build the CartItem‑compatible object (without quantity)
  const cartItem = {
    productId: product.databaseId,       // use databaseId (number)
    name: product.name,
    slug: product.slug,
    price: parseFloat(product.price) || 0,   // convert string → number
    image: {
      sourceUrl: product.image?.sourceUrl || "/placeholder.jpg",
      altText: product.image?.altText || product.name,
    },
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
            {formatPrice(parseFloat(product.price) || 0)}
          </p>
          <div
            className="prose text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />

          {/* Replace the static button with ProductActions */}
          <ProductActions item={cartItem} />
        </div>
      </div>
    </div>
  );
}