import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { NewsletterSection } from "@/components/NewsletterSection";
import type { ProductListItem } from "@/types";

const CATEGORIES = [
  { name: "Women", slug: "women", emoji: "🌸" },
  { name: "Men", slug: "men", emoji: "👟" },
  { name: "Rentals", slug: "rentals", emoji: "🏠" },
  { name: "Promotions", slug: "promotions", emoji: "🏪" },
  { name: "Driver", slug: "driver", emoji: "🚗" },
  { name: "Delivery", slug: "delivery", emoji: "🚚" },
  { name: "Food", slug: "food", emoji: "🍔" },
];

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = params?.category;

  let products: ProductListItem[] = [];

  const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!wpApiUrl) {
    console.error("❌ Missing NEXT_PUBLIC_WP_API_URL environment variable");
  } else if (!consumerKey || !consumerSecret) {
    console.error("❌ Missing WC_CONSUMER_KEY or WC_CONSUMER_SECRET environment variables");
  } else {
    try {
      // Build Basic Auth header
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      const url = `${wpApiUrl}/wp-json/wc/v3/products?per_page=100`;

      console.log("Fetching products from:", url); // Optional debug

      const res = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        throw new Error(`WooCommerce API returned ${res.status}: ${res.statusText}`);
      }

      const wooProducts = await res.json();

      products = wooProducts.map((p: any) => ({
        id: String(p.id),
        databaseId: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price ? `$${p.price}` : "$0",
        regularPrice: p.regular_price ? `$${p.regular_price}` : "$0",
        salePrice: p.sale_price ? `$${p.sale_price}` : null,
        stockStatus: p.stock_status?.toUpperCase() === "INSTOCK" ? "IN_STOCK" : "OUT_OF_STOCK",
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
        rating: parseFloat(p.average_rating) || 0,
        reviewCount: p.rating_count || 0,
        soldThisWeek: 0,
        stockCount: p.stock_quantity || 0,
        badge: "",
      }));
    } catch (error) {
      console.error("Failed to fetch WooCommerce products:", error);
    }
  }

  const filteredProducts = categorySlug
    ? products.filter((p) =>
        p.productCategories.nodes.some((c) => c.slug === categorySlug)
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
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.slug;
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
              <span>{cat.emoji}</span>
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