import { getProducts } from "@/lib/graphql/products";

interface Props {
  params: { slug: string };
}

export default async function CategoryPage({ params }: Props) {
  const products = await getProducts({
    first: 24,
    category: params.slug,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {params.slug.replace("-", " ")}
      </h1>

      <ProductGrid
        initialProducts={products.nodes}
        initialHasNextPage={products.hasNextPage}
        initialEndCursor={products.endCursor}
        category={params.slug}
      />
    </div>
  );
}