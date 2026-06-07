"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Search, X } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { cart, openCart } = useCart();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/?q=${encodeURIComponent(query)}` : "/");
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="text-lg font-bold tracking-tight">
            CampCreek<span className="text-primary">Market</span>
          </span>
        </Link>

        {/* Desktop nav + search */}
        <div className="hidden flex-1 items-center gap-4 sm:flex">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Shop All
          </Link>

          <form onSubmit={handleSearch} className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-border bg-muted/50 py-1.5 pl-8 pr-3 text-sm placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </form>
        </div>

        {/* Mobile spacer */}
        <div className="flex-1 sm:hidden" />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={searchOpen ? "Close search" : "Search"}
            onClick={() => setSearchOpen((o) => !o)}
            className="sm:hidden"
          >
            {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Open cart — ${cart.itemCount} item${cart.itemCount !== 1 ? "s" : ""}`}
            onClick={openCart}
            className="relative"
          >
            <ShoppingCart className="size-5" />
            {cart.itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cart.itemCount > 9 ? "9+" : cart.itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile search row */}
      {searchOpen && (
        <div className="border-t border-border px-4 py-3 sm:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-border bg-muted/50 py-1.5 pl-8 pr-3 text-sm placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </form>
        </div>
      )}
    </header>
  );
}
