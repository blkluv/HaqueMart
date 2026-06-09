import type { ProductListItem, Product, MockReview } from "@/types";
import Stripe from "stripe";

// ── Placeholder images (replace these with your own custom image URLs) ─────────
const placeholder = (seed: string) =>
  `https://picsum.photos/seed/${seed}/800/600`;

// ── Shared review pool (unchanged) ────────────────────────────────────────────
const REVIEWS: Record<string, MockReview[]> = {
  "mock-1": [
    { id: "r1a", author: "Sarah M.", rating: 5, date: "12 May 2026", verified: true, body: "Perfect everyday bag! The canvas quality is excellent and it holds so much more than you'd expect. Three months in and it still looks brand new — absolutely worth every penny." },
    { id: "r1b", author: "Jake T.", rating: 5, date: "3 Apr 2026", verified: true, body: "Bought this as a gym bag replacement and I'm obsessed. The clean design goes with everything and the handles are really comfortable even when loaded up." },
    { id: "r1c", author: "Priya K.", rating: 4, date: "18 Mar 2026", verified: false, body: "Great quality for the price. Stitching is solid and handles are comfortable. Only wish it had an internal zip pocket — losing my keys is a daily struggle." },
  ],
  "mock-2": [
    { id: "r2a", author: "Tom R.", rating: 5, date: "20 May 2026", verified: true, body: "Makes my morning coffee ritual feel like a luxury experience. The ceramic quality is incredible — smooth finish, perfect weight, keeps my pour-over consistently excellent." },
    { id: "r2b", author: "Emma L.", rating: 5, date: "7 May 2026", verified: true, body: "Beautiful set that genuinely brews a better cup. My friends always comment on it when they visit. Worth every penny and a joy to use every single morning." },
    { id: "r2c", author: "Chris N.", rating: 4, date: "29 Apr 2026", verified: true, body: "Stunning piece. The matte finish is gorgeous and it looks incredible on my counter. A little slow to pour but that's pour-over — just adds to the ritual." },
  ],
  "mock-3": [
    { id: "r3a", author: "Alex B.", rating: 5, date: "25 Apr 2026", verified: true, body: "Finally a desk organiser that actually looks good! The bamboo is high quality, smells lovely, and cleared up so much clutter. My home office has never looked better." },
    { id: "r3b", author: "Mia S.", rating: 4, date: "10 Apr 2026", verified: true, body: "Really solid and well made. Fits all my pens, sticky notes, and phone without looking cluttered. Slightly smaller than I expected but works perfectly for my setup." },
    { id: "r3c", author: "Dan W.", rating: 5, date: "2 Apr 2026", verified: false, body: "Bought two of these — one for home and one for the office. The bamboo has a really premium feel and the compartment sizes are very well thought out." },
  ],
  "mock-4": [
    { id: "r4a", author: "Olivia H.", rating: 5, date: "28 May 2026", verified: true, body: "THE softest beanie I've ever owned. Merino wool is incredibly warm without being itchy. I've washed it three times and it looks exactly the same. Absolute must-have." },
    { id: "r4b", author: "Ben K.", rating: 5, date: "15 May 2026", verified: true, body: "Bought this for winter hiking and it's been incredible. Warm, lightweight, and looks stylish enough to wear into town too. Already bought one for my partner." },
    { id: "r4c", author: "Zara F.", rating: 5, date: "4 May 2026", verified: true, body: "Gifted this to my brother and he won't stop raving about it. The fit is perfect and the quality is clearly excellent. Will definitely be ordering more colours." },
  ],
  "mock-5": [
    { id: "r5a", author: "Lucy P.", rating: 5, date: "22 May 2026", verified: true, body: "This colour is stunning in person — the sage is much more beautiful than the photo. The linen texture is premium and it's already completely transformed my living room." },
    { id: "r5b", author: "Ryan O.", rating: 4, date: "9 May 2026", verified: true, body: "Great quality linen, arrived beautifully packaged. The colour is a lovely sage green. Docking one star only because the zip is slightly stiff — loosened up with use though." },
    { id: "r5c", author: "Hannah C.", rating: 5, date: "1 May 2026", verified: false, body: "Ordered three of these for my sofa and they look incredible together. The linen has a lovely natural texture and the sage is so calming. Will order more shades!" },
  ],
  "mock-6": [
    { id: "r6a", author: "Marcus J.", rating: 5, date: "18 May 2026", verified: true, body: "This bottle is an absolute game changer. Keeps my coffee hot for six hours and cold drinks ice cold all day. The finish is scratch-resistant and still looks brand new." },
    { id: "r6b", author: "Isla D.", rating: 5, date: "5 May 2026", verified: true, body: "Replaced my old bottle with this and the difference is massive. Solid feel, easy to clean, and the wide mouth is perfect for ice cubes. 100% recommend." },
    { id: "r6c", author: "Noah A.", rating: 4, date: "24 Apr 2026", verified: true, body: "Really well made and keeps drinks cold for hours. Lid is easy to open one-handed which is a game changer on walks. Slightly heavy but totally worth it for the quality." },
  ],
  "mock-7": [
    { id: "r7a", author: "Sophie B.", rating: 5, date: "26 May 2026", verified: true, body: "The cedarwood scent is perfect — warm and woody without being overpowering. Burns cleanly for hours and the soy wax means no soot. My living room smells amazing." },
    { id: "r7b", author: "Finn L.", rating: 5, date: "14 May 2026", verified: true, body: "Bought three as gifts and they were a massive hit. The packaging is gorgeous and the candle itself is high quality. Much nicer than the big brand candles at double the price." },
    { id: "r7c", author: "Ava M.", rating: 4, date: "2 May 2026", verified: true, body: "Really lovely candle with a subtle scent throw. Perfect for a bedroom or study. Would love a slightly stronger throw for a bigger room but otherwise perfect." },
  ],
  "mock-8": [
    { id: "r8a", author: "James T.", rating: 5, date: "8 May 2026", verified: true, body: "The leather quality on this notebook is exceptional. Soft, supple, and already developing a beautiful patina. The paper inside is thick enough to use fountain pens without bleed-through." },
    { id: "r8b", author: "Chloe R.", rating: 4, date: "27 Apr 2026", verified: true, body: "Gorgeous notebook — feels luxurious in hand. The A5 size is perfect for work notes. Only slight issue is it was out of stock when I first tried to order; well worth the wait!" },
    { id: "r8c", author: "Leo G.", rating: 5, date: "15 Apr 2026", verified: false, body: "Bought as a birthday gift and the recipient was genuinely thrilled. The leather smells incredible straight out of the box and the stitching is immaculate. Highly recommend." },
  ],
};

// ── Product listings (keep your original MOCK_PRODUCTS) ────────────────────────
export const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: "mock-1", databaseId: 1,
    name: "Minimalist Canvas Tote", slug: "minimalist-canvas-tote",
    price: "$24.99", regularPrice: "$24.99", salePrice: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("tote-bag"), altText: "Minimalist Canvas Tote" },
    productCategories: { nodes: [{ name: "Bags", slug: "bags" }] },
    rating: 4.7, reviewCount: 83, soldThisWeek: 14, stockCount: 4, badge: "best-seller",
  },
  {
    id: "mock-2", databaseId: 2,
    name: "Matte Ceramic Pour-Over Set", slug: "matte-ceramic-pour-over-set",
    price: "$34.99", regularPrice: "$44.99", salePrice: "$34.99",
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("coffee-set"), altText: "Ceramic Pour-Over Set" },
    productCategories: { nodes: [{ name: "Kitchen", slug: "kitchen" }] },
    rating: 4.6, reviewCount: 61, soldThisWeek: 9, stockCount: 7, badge: "trending",
  },
  {
    id: "mock-3", databaseId: 3,
    name: "Bamboo Desk Organiser", slug: "bamboo-desk-organiser",
    price: "$19.99", regularPrice: "$19.99", salePrice: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("desk-organiser"), altText: "Bamboo Desk Organiser" },
    productCategories: { nodes: [{ name: "Home Office", slug: "home-office" }] },
    rating: 4.4, reviewCount: 47, soldThisWeek: 7, stockCount: 12,
  },
  {
    id: "mock-4", databaseId: 4,
    name: "Merino Wool Beanie", slug: "merino-wool-beanie",
    price: "$18.00", regularPrice: "$25.00", salePrice: "$18.00",
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("beanie-hat"), altText: "Merino Wool Beanie" },
    productCategories: { nodes: [{ name: "Clothing", slug: "clothing" }] },
    rating: 4.8, reviewCount: 124, soldThisWeek: 22, stockCount: 3, badge: "best-seller",
  },
  {
    id: "mock-5", databaseId: 5,
    name: "Linen Cushion Cover – Sage", slug: "linen-cushion-cover-sage",
    price: "$14.99", regularPrice: "$14.99", salePrice: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("cushion-cover"), altText: "Linen Cushion Cover" },
    productCategories: { nodes: [{ name: "Home", slug: "home" }] },
    rating: 4.3, reviewCount: 39, soldThisWeek: 5, stockCount: 9, badge: "new",
  },
  {
    id: "mock-6", databaseId: 6,
    name: "Stainless Water Bottle 750ml", slug: "stainless-water-bottle-750ml",
    price: "$22.00", regularPrice: "$22.00", salePrice: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("water-bottle"), altText: "Stainless Water Bottle" },
    productCategories: { nodes: [{ name: "Outdoors", slug: "outdoors" }] },
    rating: 4.5, reviewCount: 92, soldThisWeek: 18, stockCount: 6, badge: "trending",
  },
  {
    id: "mock-7", databaseId: 7,
    name: "Scented Soy Candle – Cedarwood", slug: "scented-soy-candle-cedarwood",
    price: "$12.99", regularPrice: "$16.99", salePrice: "$12.99",
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("soy-candle"), altText: "Scented Soy Candle" },
    productCategories: { nodes: [{ name: "Home", slug: "home" }] },
    rating: 4.6, reviewCount: 58, soldThisWeek: 11, stockCount: 8,
  },
  {
    id: "mock-8", databaseId: 8,
    name: "Leather A5 Notebook", slug: "leather-a5-notebook",
    price: "$17.50", regularPrice: "$17.50", salePrice: null,
    stockStatus: "OUT_OF_STOCK",
    image: { sourceUrl: placeholder("leather-notebook"), altText: "Leather A5 Notebook" },
    productCategories: { nodes: [{ name: "Stationery", slug: "stationery" }] },
    rating: 4.2, reviewCount: 29, soldThisWeek: 3, stockCount: 0,
  },
];

// ── Mapped product details (kept as is) ────────────────────────────────────────
export const MOCK_PRODUCT_MAP: Record<string, Product> = Object.fromEntries(
  MOCK_PRODUCTS.map((p) => [
    p.slug,
    {
      ...p,
      description: `<p>A beautifully crafted ${p.name.toLowerCase()}. Made with quality materials and designed to last.</p>`,
      shortDescription: `Quality ${p.name.toLowerCase()} — perfect for everyday use.`,
      stockQuantity: p.stockStatus === "IN_STOCK" ? (p.stockCount ?? 10) : 0,
      galleryImages: { nodes: [] },
      reviews: REVIEWS[p.id] ?? [],
      viewingSeed: [12, 8, 6, 15, 5, 11, 7, 4][parseInt(p.id.replace("mock-", "")) - 1] ?? 6,
    },
  ])
);

export const MOCK_CATEGORIES = [
  "Driver", "Delivery", "Shoes", "Clothing", "Rentals", "Services", "Boost My Biz",
];

// ────────────── NEW: Stripe helper functions (added below) ─────────────────────

/**
 * Converts a price string like "$24.99" into an amount in cents.
 */
function parsePriceToCents(priceString: string | null | undefined): number | null {
  if (!priceString) return null;
  const match = priceString.match(/\d+(?:\.\d{1,2})?/);
  if (!match) return null;
  const dollars = parseFloat(match[0]);
  return Math.round(dollars * 100);
}

/**
 * Generates Stripe product parameters from your mock product.
 * Uses the existing `image.sourceUrl` (which you can later replace with a custom image).
 */
export function mockToStripeProduct(mockProduct: ProductListItem): Stripe.ProductCreateParams {
  return {
    id: mockProduct.id,                     // custom product ID (e.g., "mock-1")
    name: mockProduct.name,
    description: `A beautifully crafted ${mockProduct.name.toLowerCase()}. Made with quality materials and designed to last.`,
    metadata: {
      slug: mockProduct.slug,
      databaseId: String(mockProduct.databaseId),
      stockCount: String(mockProduct.stockCount ?? 0),
      stockStatus: mockProduct.stockStatus,
      badge: mockProduct.badge ?? '',
      soldThisWeek: String(mockProduct.soldThisWeek ?? 0),
      categories: mockProduct.productCategories.nodes.map(c => c.name).join(',')
    },
    images: [mockProduct.image?.sourceUrl || "/placeholder.jpg"],   // unique per product (replace with your own URLs)
    tax_code: 'txcd_10000000',
    active: true,
    shippable: true,
    url: `https://yourstore.com/product/${mockProduct.slug}`
  };
}

/**
 * Generates one or two Stripe price parameters for a product.
 */
export function mockToStripePrices(mockProduct: ProductListItem): Stripe.PriceCreateParams[] {
  const regularCents = parsePriceToCents(mockProduct.regularPrice);
  const saleCents = parsePriceToCents(mockProduct.salePrice);
  
  if (!regularCents) return [];

  const prices: Stripe.PriceCreateParams[] = [];

  prices.push({
    product: mockProduct.id,
    currency: 'usd',
    unit_amount: regularCents,
    nickname: 'Regular price',
    active: true,
    metadata: { type: 'regular' }
  });

  if (saleCents && saleCents !== regularCents) {
    prices.push({
      product: mockProduct.id,
      currency: 'usd',
      unit_amount: saleCents,
      nickname: 'Sale price',
      active: true,
      metadata: { type: 'sale' }
    });
  }

  return prices;
}

/**
 * Helper to create all products and prices in Stripe.
 * Call this function with your Stripe instance.
 */
export async function createStripeProductsAndPrices(stripe: Stripe) {
  const productParamsList = MOCK_PRODUCTS.map(mockToStripeProduct);
  const priceParamsList = MOCK_PRODUCTS.flatMap(mockToStripePrices);

  console.log(`Creating ${productParamsList.length} products...`);
  for (const params of productParamsList) {
    try {
      const product = await stripe.products.create(params);
      console.log(`✅ Created product: ${product.name} (${product.id})`);
    } catch (err: any) {
      if (err.type === 'StripeInvalidRequestError' && err.code === 'resource_already_exists') {
        console.log(`⚠️ Product ${params.id} already exists – skipping`);
      } else {
        console.error(`❌ Failed to create product ${params.id}:`, err.message);
      }
    }
  }

  console.log(`\nCreating ${priceParamsList.length} prices...`);
  for (const params of priceParamsList) {
    try {
      const price = await stripe.prices.create(params);
      console.log(`✅ Created price ${price.id} for product ${params.product}`);
    } catch (err: any) {
      console.error(`❌ Failed to create price:`, err.message);
    }
  }
}