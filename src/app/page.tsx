import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { NewsletterSection } from "@/components/NewsletterSection";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { use } from "react";

interface Props {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default function HomePage({ searchParams }: Props) {
  const params = use(searchParams);
  const category = params?.category;

  const filteredProducts = category
    ? MOCK_PRODUCTS.filter((p) =>
        p.productCategories.nodes.some(
          (c) => c.slug === category || c.name.toLowerCase() === category
        )
      )
    : MOCK_PRODUCTS;

  const activeCategory = category ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-16">
      <HeroSection />

      <section className="text-center">
        <h1 className="text-3xl font-bold">Discover Products</h1>
        <p className="text-muted-foreground mt-2">
          Browse curated collections by category
        </p>
      </section>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap gap-2 justify-center">
        <a
          href="/"
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !activeCategory ? "bg-orange-500 text-white border-orange-500" : ""
          }`}
        >
          All
        </a>

        {MOCK_CATEGORIES.map((cat) => {
          const slug = cat.toLowerCase().replace(/\s+/g, "-");
          const isActive = activeCategory === slug;

          return (
            <a
              key={cat}
              href={`/?category=${slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                isActive
                  ? "bg-orange-500 text-white border-orange-500"
                  : "hover:bg-muted"
              }`}
            >
              {cat}
            </a>
          );
        })}
      </div>

      <ProductGrid
        initialProducts={filteredProducts}
        initialHasNextPage={false}
        initialEndCursor={null}
        category={category}
      />

      <NewsletterSection />
    </div>
  );
}
