"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Flame, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { parsePrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useWishlist } from "@/lib/wishlist/context";
import type { ProductListItem } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-3",
              i < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  );
}

const BADGE_CONFIG = {
  "best-seller": { label: "Best Seller", icon: Flame, className: "bg-orange-500 text-white" },
  trending:      { label: "Trending",    icon: Zap,   className: "bg-violet-600 text-white" },
  new:           { label: "New",         icon: Sparkles, className: "bg-emerald-500 text-white" },
} as const;

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  product: ProductListItem;
}

export function ProductCard({ product }: Props) {
  const { has, toggle } = useWishlist();
  const wishlisted = has(product.id);

  const isOnSale = product.salePrice !== null && product.salePrice !== product.regularPrice;
  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK";
  const isLowStock = !isOutOfStock && product.stockCount !== undefined && product.stockCount <= 5;
  const badgeCfg = product.badge ? BADGE_CONFIG[product.badge] : null;

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">

      {/* ── Image ── */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-muted block">
        {product.image ? (
          <Image
            src={product.image.sourceUrl}
            alt={product.image.altText || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-105",
              isOutOfStock && "opacity-50 grayscale",
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}

        {/* Top-left badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {isOutOfStock ? (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground shadow-sm">
              Sold out
            </span>
          ) : isOnSale ? (
            <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
              Sale
            </span>
          ) : null}

          {badgeCfg && !isOutOfStock && (
            <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm", badgeCfg.className)}>
              <badgeCfg.icon className="size-3" />
              {badgeCfg.label}
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full border border-border/60 bg-card/90 shadow-md backdrop-blur transition-all duration-200 hover:scale-110 hover:border-primary/40 active:scale-95"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground",
            )}
          />
        </button>
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">

        {/* Category */}
        {product.productCategories.nodes[0] && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.productCategories.nodes[0].name}
          </span>
        )}

        {/* Name */}
        <Link
          href={`/product/${product.slug}`}
          className="font-semibold leading-snug transition-colors hover:text-primary line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Stars */}
        {product.rating && product.reviewCount ? (
          <StarRating rating={product.rating} count={product.reviewCount} />
        ) : null}

        {/* FOMO row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {product.soldThisWeek && product.soldThisWeek > 0 && (
            <span className="text-muted-foreground">
              🔥 <strong className="text-foreground">{product.soldThisWeek}</strong> sold this week
            </span>
          )}
          {isLowStock && (
            <span className="font-semibold text-red-500">
              🔥 Trending
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-baseline gap-2">
            <span className={cn("font-bold", isOnSale && "text-primary")}>
              {product.price ?? product.regularPrice ?? "—"}
            </span>
            {isOnSale && product.regularPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.regularPrice}
              </span>
            )}
          </div>
          <AddToCartButton
  item={{
    productId: product.databaseId,
    databaseId: product.databaseId,
    name: product.name,
    slug: product.slug,
    price: parsePrice(product.price ?? product.regularPrice),
    priceFormatted: product.price ?? product.regularPrice ?? "$0",
    regularPrice: product.regularPrice,
    salePrice: product.salePrice,
    stockStatus: product.stockStatus,
    image: product.image,
    productCategories: product.productCategories,
    rating: product.rating,
    reviewCount: product.reviewCount,
    soldThisWeek: product.soldThisWeek,
    stockCount: product.stockCount,
    badge: product.badge,
  }}
  disabled={isOutOfStock}
  size="sm"
/>
        </div>
      </div>
    </div>
  );
}
