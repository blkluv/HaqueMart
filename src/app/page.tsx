import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { NewsletterSection } from "@/components/NewsletterSection";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { getWooProducts } from "@/lib/rest/products";

interface Props {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params?.category;

  let products = MOCK_PRODUCTS;

  try {
    const woo = await getWooProducts();

    if (Array.isArray(woo)) {
      products = woo.map((p: any) => ({
        id: String(p.id),
        databaseId: p.id,

        name: p.name,
        slug: p.slug,

        price: p.price ? `£${p.price}` : "£0",
        regularPrice: p.regular_price ? `£${p.regular_price}` : "£0",
        salePrice: p.sale_price ? `£${p.sale_price}` : null,

        stockStatus: p.stock_status?.toUpperCase() ?? "IN_STOCK",

        image: {
          sourceUrl: p.images?.[0]?.src ?? "",
          altText: p.name ?? "",
        },

        productCategories: {
          nodes: (p.categories ?? []).map((c: any) => ({
            name: c.name,
            slug: c.slug,
          })),
        },

        rating: Number(p.average_rating ?? 0),
        reviewCount: Number(p.rating_count ?? 0),
        soldThisWeek: 0,
        stockCount: p.stock_quantity ?? 0,
      }));
    }
  } catch (err) {
    // fallback to mock silently
    console.log("WooCommerce fallback:", err);
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
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !activeCategory
              ? "bg-orange-500 text-white border-orange-500"
              : ""
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