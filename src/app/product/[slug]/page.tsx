import { notFound } from "next/navigation";
import { getProduct } from "@/lib/graphql/products";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold">{product.name}</h1>

      <p className="text-muted-foreground mt-2">
        {product.shortDescription}
      </p>

      {/* reuse your existing UI components here */}
    </div>
  );
}