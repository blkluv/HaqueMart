import { ProductGrid } from "@/components/ProductGrid";
import { NewsletterSection } from "@/components/NewsletterSection";
import { HeroSection } from "@/components/HeroSection";
import { isWpConfigured } from "@/lib/graphql/client";
import { getProducts, getCategories } from "@/lib/graphql/products";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import type { ProductListItem } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { category?: string; q?: string };
}

const CATEGORY_SHOWCASE = [
  { name: "Bags", slug: "bags", emoji: "👜", desc: "Totes, backpacks & more" },
  { name: "Kitchen", slug: "kitchen", emoji: "☕", desc: "Brew & cook in style" },
  { name: "Home Office", slug: "home-office", emoji: "🖊️", desc: "Level up your desk" },
  { name: "Clothing", slug: "clothing", emoji: "🧢", desc: "Cosy everyday wear" },
  { name: "Home", slug: "home", emoji: "🕯️", desc: "Make your space yours" },
  { name: "Outdoors", slug: "outdoors", emoji: "🏕️", desc: "Gear up for adventure" },
];

export default async function HomePage({ searchParams }: Props) {
  const { category, q } = searchParams;

  const searchQuery = q?.trim() ?? "";

  let products: ProductListItem[] = [];
  let categories: string[] = [];
  let usingMock = false;
  let hasNextPage = false;
  let endCursor: string | null = null;

  if (isWpConfigured()) {
    try {
      const [productsResult, categoryNames] = await Promise.all([
        getProducts({ first: 12, category }),
        getCategories(),
      ]);

      products = productsResult.nodes;
      hasNextPage = productsResult.hasNextPage;
      endCursor = productsResult.endCursor;
      categories = categoryNames;
    } catch {
      products = MOCK_PRODUCTS;
      categories = MOCK_CATEGORIES;
      usingMock = true;
    }
  } else {
    products = MOCK_PRODUCTS;
    categories = MOCK_CATEGORIES;
    usingMock = true;
  }

  const canLoadMore = !searchQuery && hasNextPage;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-16">

      <HeroSection />

      {usingMock && (
        <div className="-mt-8 rounded-lg border border-primary/20 bg-primary/8 px-4 py-3 text-sm text-primary/90">
          <strong>Demo mode</strong> — showing sample products.
        </div>
      )}

      <section id="products" className="flex flex-col gap-6">

        {searchQuery && (
          <p className="text-sm text-muted-foreground">
            {products.length > 0 ? `${products.length} results for ` : "No results for "}
            <strong>&ldquo;{searchQuery}&rdquo;</strong>
          </p>
        )}

        {!searchQuery && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <a href="/" className="rounded-full border px-4 py-1.5 text-sm font-medium">
              All
            </a>

            {categories.map((cat) => {
              const slug = cat.toLowerCase().replace(/\s+/g, "-");

              return (
                <a
                  key={cat}
                  href={`/?category=${slug}`}
                  className="rounded-full border px-4 py-1.5 text-sm font-medium"
                >
                  {cat}
                </a>
              );
            })}
          </div>
        )}

        <ProductGrid
          initialProducts={products}
          initialHasNextPage={canLoadMore}
          initialEndCursor={endCursor}
          category={category}
        />
      </section>

      {!searchQuery && !category && (
        <section className="flex flex-col gap-6">

          <div className="text-center">
            <h2 className="text-2xl font-bold">Shop by category</h2>
            <p className="mt-1 text-muted-foreground">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {CATEGORY_SHOWCASE.map(({ name, slug, emoji, desc }) => (
              <a
                key={slug}
                href={`/?category=${slug}`}
                className="flex flex-col items-center gap-2 rounded-xl border p-6 text-center"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="font-semibold">{name}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </a>
            ))}
          </div>

        </section>
      )}

      <NewsletterSection />
    </div>
  );
}