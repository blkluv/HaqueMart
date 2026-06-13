import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { NewsletterSection } from "@/components/NewsletterSection";
import type { ProductListItem, StockStatus } from "@/types";

// Emoji mapping for known categories
const categoryEmoji: Record<string, string> = {
  women: "🌸",
  men: "👟",
  rentals: "🏠",
  promo: "🏪",
  driver: "🚗",
  delivery: "🚚",
  food: "🍔",
};

// ── Helpers ────────────────────────────────────────────────────────────────

const mapStockStatus = (status: string): StockStatus => {
  switch (status) {
    case "instock":
      return "IN_STOCK";
    case "onbackorder":
      return "ON_BACKORDER";
    default:
      return "OUT_OF_STOCK";
  }
};

interface Props {
  searchParams: { category?: string };
}

export default async function HomePage({ searchParams }: Props) {
  const categorySlug = searchParams?.category;

  let products: ProductListItem[] = [];
  let categories: Array<{ name: string; slug: string }> = [];

  const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!wpApiUrl) {
    console.error("❌ Missing NEXT_PUBLIC_WP_API_URL environment variable");
  } else if (!consumerKey || !consumerSecret) {
    console.error(
      "❌ Missing WC_CONSUMER_KEY or WC_CONSUMER_SECRET environment variables"
    );
  } else {
    try {
      const auth = Buffer.from(
        `${consumerKey}:${consumerSecret}`
      ).toString("base64");

      // ── Fetch products ────────────────────────────────────────────────
      const productsUrl = `${wpApiUrl}/wp-json/wc/v3/products?per_page=100`;

      const productsRes = await fetch(productsUrl, {
        headers: { Authorization: `Basic ${auth}` },
        next: { revalidate: 60 },
      });

      if (!productsRes.ok) {
        throw new Error(
          `WooCommerce API returned ${productsRes.status}`
        );
      }

      const wooProducts = await productsRes.json();

      // ── STRICT mapping (NO any) ───────────────────────────────────────
      products = wooProducts.map((p: any): ProductListItem => ({
        id: String(p.id),
        databaseId: p.id,
        name: p.name,
        slug: p.slug,

        price: p.price ? `$${p.price}` : "$0",
        regularPrice: p.regular_price
          ? `$${p.regular_price}`
          : "$0",
        salePrice: p.sale_price ? `$${p.sale_price}` : null,

        stockStatus: mapStockStatus(p.stock_status),

        image: {
          sourceUrl: p.images?.[0]?.src || "/placeholder.jpg",
          altText: p.images?.[0]?.alt || p.name,
        },

        productCategories: {
          nodes: (p.categories || []).map((cat: any) => ({
            name: cat.name,
            slug: cat.slug,
          })),
        },

        rating: Number(p.average_rating ?? 0),
        reviewCount: Number(p.rating_count ?? 0),

        soldThisWeek: 0,
        stockCount: Number(p.stock_quantity ?? 0),

        badge: undefined,
      }));

      // ── Build categories ─────────────────────────────────────────────
      const categoryMap = new Map<
        string,
        { name: string; slug: string }
      >();

      products.forEach((p) => {
        p.productCategories.nodes.forEach((cat) => {
          if (cat.slug !== "uncategorized") {
            categoryMap.set(cat.slug, {
              name: cat.name,
              slug: cat.slug,
            });
          }
        });
      });

      categories = Array.from(categoryMap.values());
    } catch (error) {
      console.error(
        "Failed to fetch data from WooCommerce:",
        error
      );
    }
  }

  // ── Filter products ───────────────────────────────────────────────────
  const filteredProducts = categorySlug
    ? products.filter((p) =>
        p.productCategories.nodes.some(
          (c) => c.slug === categorySlug
        )
      )
    : products;

  const activeCategory = categorySlug ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-16">
      <HeroSection />

      <section className="text-center">
        <h1 className="text-3xl font-bold">Discover Products</h1>
        <p className="text-muted-foreground mt-2">
          Browse curated collections by category
        </p>
      </section>

      <div className="flex flex-wrap gap-2 justify-center">
        <a
          href="/"
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !activeCategory
              ? "bg-orange-500 text-white border-orange-500"
              : "hover:bg-muted"
          }`}
        >
          All
        </a>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          const emoji = categoryEmoji[cat.slug] ?? "📦";

          return (
            <a
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition flex items-center gap-1 ${
                isActive
                  ? "bg-orange-500 text-white border-orange-500"
                  : "hover:bg-muted"
              }`}
            >
              <span>{emoji}</span>
              <span>{cat.name}</span>
            </a>
          );
        })}
      </div>

      <ProductGrid
        initialProducts={filteredProducts}
        initialHasNextPage={false}
        initialEndCursor={null}
        category={categorySlug}
      />

      <NewsletterSection />
    </div>
  );
}