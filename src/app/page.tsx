import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { NewsletterSection } from "@/components/NewsletterSection";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";

interface Props {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { category } = await searchParams;

  const filteredProducts = category
    ? MOCK_PRODUCTS.filter((p) =>
        p.productCategories.nodes.some((c) => c.slug === category)
      )
    : MOCK_PRODUCTS;

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
            !category
              ? "bg-orange-500 text-white border-orange-500"
              : "hover:border-orange-400 hover:text-orange-500"
          }`}
        >
          All
        </a>

        {MOCK_CATEGORIES.map((cat) => {
          const slug = cat.toLowerCase().replace(/\s+/g, "-");
          const isActive = category === slug;

          return (
            <a
              key={cat}
              href={`/?category=${slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                isActive
                  ? "bg-orange-500 text-white border-orange-500"
                  : "hover:border-orange-400 hover:text-orange-500"
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