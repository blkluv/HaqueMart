"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { fetchMoreProducts } from "@/lib/actions";
import type { ProductListItem } from "@/types";

interface Props {
  initialProducts: ProductListItem[];
  initialHasNextPage: boolean;
  initialEndCursor: string | null;
  category?: string;
}

export function ProductGrid({
  initialProducts,
  initialHasNextPage,
  initialEndCursor,
  category,
}: Props) {
  const [products, setProducts] = useState<ProductListItem[]>(initialProducts);
  const [hasNextPage, setHasNextPage] = useState<boolean>(initialHasNextPage);
  const [cursor, setCursor] = useState<string | null>(initialEndCursor);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    if (!cursor) return;

    startTransition(async () => {
      try {
        const result = await fetchMoreProducts(cursor, category);

        setProducts((prev) => [...prev, ...(result?.nodes ?? [])]);
        setHasNextPage(Boolean(result?.hasNextPage));
        setCursor(result?.endCursor ?? null);
      } catch (err) {
        console.error("Failed to load more products:", err);
      }
    });
  }

  if (!products || products.length === 0) {
    return (
      <p className="py-20 text-center text-muted-foreground">
        No products found.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={isPending}
            className="min-w-36 gap-2"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}