# HaqueMart

**Headless WooCommerce storefront.** WordPress + WooCommerce powers the catalogue; a Next.js frontend consumes it over WPGraphQL. Ships with a curated mock catalogue so the demo works without a live WordPress backend.

**Live demo:** https://campcreekmarket.com

## Stack

- **Next.js 15** (App Router) — server-rendered product pages, no API key exposure
- **WordPress + WooCommerce + WPGraphQL** — headless commerce backend
- **shadcn/ui + Tailwind** — dark amber-on-charcoal design system
- **React Context + localStorage** — cart and wishlist state

## Quickstart

```bash
# 1. Clone and install
git clone <repo-url>
cd haquemart
npm install

# 2. Set env vars
cp .env.example .env.local
# Optional: set NEXT_PUBLIC_WP_GRAPHQL_URL to your WooCommerce WPGraphQL endpoint
# Leave unset to run in demo mode with mock products

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without `NEXT_PUBLIC_WP_GRAPHQL_URL` the site runs in demo mode with sample products.

## Connecting a WooCommerce store

1. Install [WPGraphQL](https://www.wpgraphql.com/) and [WooGraphQL](https://woographql.com/) on your WordPress site.
2. Set `NEXT_PUBLIC_WP_GRAPHQL_URL=https://your-store.com/graphql` in `.env.local`.
3. Restart the dev server — live products replace the mock catalogue automatically.

## Features

- Product grid with category filters, text search, and load-more pagination
- Product detail pages with quantity selector and add-to-cart
- Persistent cart drawer (survives page reload via `localStorage`)
- Wishlist
- Checkout form with order confirmation
- SEO: `sitemap.ts` + `robots.ts`
- Fully responsive

See [ARCHITECTURE.md](ARCHITECTURE.md) for full system design.
