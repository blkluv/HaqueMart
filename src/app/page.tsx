import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { NewsletterSection } from "@/components/NewsletterSection";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { getWooProducts } from "@/lib/rest/products";

export default async function HomePage({ searchParams }: any) {
  const category = searchParams?.category;

  let products = MOCK_PRODUCTS;

  try {
    const woo = await getWooProducts();

    if (Array.isArray(woo)) {
      products = woo.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: {
          sourceUrl: p.images?.[0]?.src ?? "",
          altText: p.name,
        },
        productCategories: {
          nodes: p.categories?.map((c: any) => ({
            name: c.name,
            slug: c.slug,
          })) ?? [],
        },
      }));
    }
  } catch {
    // fallback silently to mock
  }

  const filteredProducts = category
    ? products.filter((p) =>
        p.productCategories.nodes.some(
          (c) =>
            c.slug === category ||
            c.name.toLowerCase() === category
        )
      )
    : products;

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
          className={`rounded-full border px-4 py-1.5 text-sm ${
            !activeCategory ? "bg-orange-500 text-white" : ""
          }`}
        >
          All
        </a>

        {MOCK_CATEGORIES.map((cat) => {
          const slug = cat.toLowerCase().replace(/\s+/g, "-");

          return (
            <a
              key={cat}
              href={`/?category=${slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                activeCategory === slug
                  ? "bg-orange-500 text-white"
                  : ""
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
