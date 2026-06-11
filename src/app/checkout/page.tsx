"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Loader2, Package } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { placeOrder } from "@/lib/actions";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

const labelClass = "block text-sm font-medium mb-1.5";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [mounted, setMounted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "Atlanta",
    state: "GA",
    postcode: "",
    country: "United States",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to shop once we know the cart is empty (and not mid-submit)
  useEffect(() => {
    if (mounted && cart.items.length === 0 && !placing) {
      router.replace("/");
    }
  }, [mounted, cart.items.length, placing, router]);

  function setField<K extends keyof typeof form>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let value = e.target.value;
      if (field === "city") {
        const trimmed = value.trim();
        if (trimmed.toLowerCase() !== "atlanta") {
          value = "Atlanta";
        } else {
          value = "Atlanta";
        }
      }
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Extra validation: ensure city is exactly Atlanta
    if (form.city.toLowerCase() !== "atlanta") {
      setError("Sorry, shipping is only available within Atlanta, GA.");
      return;
    }

    if (cart.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacing(true);

    // Map cart items to the format expected by placeOrder
    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const shipping = {
      firstName: form.firstName,
      lastName: form.lastName,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      postcode: form.postcode,
      country: form.country,
      email: form.email,
    };

    const result = await placeOrder(orderItems, shipping);

    if (result.success) {
      clearCart();
      router.push(`/checkout/success?order=${result.orderId}`);
    } else {
      setPlacing(false);
      setError(result.error || "Something went wrong. Please try again.");
    }
  }

  // Don't render before hydration — avoids SSR/client cart mismatch
  if (!mounted) return null;
  if (cart.items.length === 0 && !placing) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-4" />
        Continue shopping
      </Link>

      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]"
      >
        {/* Left — Shipping form (Atlanta‑only) */}
        <div className="flex flex-col gap-8">
          {/* Atlanta shipping notice */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            📦 We currently ship <strong>only within Atlanta, GA</strong>. Thank you for supporting local!
          </div>

          {/* Error banner */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Contact */}
          <section>
            <h2 className="mb-4 text-base font-semibold">Contact</h2>
            <div>
              <label className={labelClass}>Email address</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={setField("email")}
                className={inputClass}
              />
            </div>
          </section>

          {/* Shipping address — Atlanta only */}
          <section>
            <h2 className="mb-4 text-base font-semibold">
              Shipping address (Atlanta only)
            </h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First name</label>
                  <input
                    type="text"
                    required
                    autoComplete="given-name"
                    placeholder="John"
                    value={form.firstName}
                    onChange={setField("firstName")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last name</label>
                  <input
                    type="text"
                    required
                    autoComplete="family-name"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={setField("lastName")}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Address line 1</label>
                <input
                  type="text"
                  required
                  autoComplete="address-line1"
                  placeholder="123 Peachtree Street"
                  value={form.address1}
                  onChange={setField("address1")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Address line 2{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  autoComplete="address-line2"
                  placeholder="Apt 4B"
                  value={form.address2}
                  onChange={setField("address2")}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={setField("city")}
                    className={inputClass}
                    readOnly
                    disabled
                    placeholder="Atlanta (only)"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Only Atlanta is eligible for delivery.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input
                    type="text"
                    required
                    value="Georgia"
                    disabled
                    className={`${inputClass} bg-muted`}
                  />
                  <input type="hidden" name="state" value="GA" />
                </div>
              </div>

              <div>
                <label className={labelClass}>ZIP / Postal code</label>
                <input
                  type="text"
                  required
                  autoComplete="postal-code"
                  placeholder="30303"
                  value={form.postcode}
                  onChange={setField("postcode")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Country</label>
                <input
                  type="text"
                  required
                  value="United States"
                  disabled
                  className={`${inputClass} bg-muted`}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right — Order summary */}
        <aside className="flex h-fit flex-col gap-4 rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-semibold">Order summary</h2>

          <ul className="flex flex-col divide-y divide-border">
            {cart.items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image.sourceUrl}
                      alt={item.image.altText || item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-muted-foreground text-[10px] font-bold text-background">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="line-clamp-2 text-sm font-medium leading-snug">
                    {item.name}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(cart.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-muted-foreground">
                Calculated at dispatch (Atlanta only)
              </span>
            </div>
          </div>

          <div className="flex justify-between border-t border-border pt-3 font-semibold">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full gap-2"
            disabled={placing}
          >
            {placing && <Loader2 className="size-4 animate-spin" />}
            {placing ? "Placing order…" : "Place order"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Orders are processed securely via Stripe. Delivery only within Camp Creek, Atlanta, GA.
          </p>
        </aside>
      </form>
    </div>
  );
}