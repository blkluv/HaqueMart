import { ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/lib/graphql/products";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";

  const results = await getProducts({
    first: 24,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-xl font-bold mb-4">
        Search results for "{query}"
      </h1>

      <ProductGrid
        initialProducts={results.nodes}
        initialHasNextPage={results.hasNextPage}
        initialEndCursor={results.endCursor}
      />
    </div>
  );
}