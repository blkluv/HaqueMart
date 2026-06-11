"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/QuantitySelector";

const FREE_SHIPPING_THRESHOLD = 50;

export function CartDrawer() {
  const { cart, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cart.total);
  const shippingProgress = Math.min(100, (cart.total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h2 className="font-semibold">
            Your Cart
            {mounted && cart.itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""})
              </span>
            )}
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart">
            <X />
          </Button>
        </div>

        {/* Free shipping progress bar — wrapped with mounted to avoid hydration mismatch */}
        {mounted && cart.items.length > 0 && (
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            {remaining > 0 ? (
              <p className="mb-2 text-center text-xs text-muted-foreground">
                You&apos;re{" "}
                <strong className="text-foreground">{formatPrice(remaining)}</strong>{" "}
                away from <strong className="text-foreground">free shipping!</strong>
              </p>
            ) : (
              <p className="mb-2 text-center text-xs font-semibold text-emerald-400">
                🎉 You&apos;ve unlocked free shipping!
              </p>
            )}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!mounted || cart.items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
              <ShoppingBag className="size-12 opacity-20" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm">Add something you love to get started.</p>
              <Button variant="outline" size="sm" onClick={closeCart}>
                Continue shopping
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image.sourceUrl}
                        alt={item.image.altText || item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="truncate text-sm font-medium hover:text-primary"
                      onClick={closeCart}
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm font-semibold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.productId, q)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.productId)}
                        className="size-7 text-muted-foreground hover:text-destructive"
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — also wrapped to prevent future mismatches */}
        {mounted && cart.items.length > 0 && (
          <div className="border-t border-border px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(cart.total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className={remaining > 0 ? "text-muted-foreground" : "font-semibold text-emerald-400"}>
                {remaining > 0 ? "Calculated at checkout" : "Free"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Taxes calculated at checkout.
            </p>
            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full" size="lg">
                Proceed to checkout — {formatPrice(cart.total)}
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={closeCart}>
              Continue shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
}