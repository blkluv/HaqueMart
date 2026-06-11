import { notFound } from "next/navigation";
import { getProduct } from "@/lib/graphql/products";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // Reject invalid or missing slugs early
  if (!slug || slug === "undefined") notFound();

  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Simple product detail layout (customise as you like) */}
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
            {formatPrice(product.price)}
          </p>
          <div
            className="prose text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />
          <Button size="lg" className="w-full md:w-auto">
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}