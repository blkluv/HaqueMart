"use client";
import type { Cart } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Loader2, Package, MapPin } from "lucide-react";
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

  const [addressType, setAddressType] =
    useState<"traditional" | "rwatok">("traditional");

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
    rwatok: "",
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && cart.items.length === 0 && !placing) {
      router.replace("/");
    }
  }, [mounted, cart.items.length, placing, router]);

  function setField<K extends keyof typeof form>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let value = e.target.value;
      if (field === "city") value = "Atlanta";
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (cart.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacing(true);

    const orderItems = cart.items.map((item) => ({
  productId: item.productId,
  quantity: item.quantity,
  }));

    const shipping = {
      firstName: form.firstName,
      lastName: form.lastName,
      address1:
        addressType === "rwatok"
          ? `///${form.rwatok}`
          : form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      postcode: form.postcode,
      country: form.country,
      email: form.email,
      rwatok: addressType === "rwatok" ? form.rwatok : null,
    };

    const result = await placeOrder(orderItems, shipping);

    if (result.success) {
      clearCart();

      // ✅ FIXED: no WooCommerce order-pay assumption
      // Your system uses step checkout flow
      const redirectUrl =
        result.checkoutUrl ||
        "https://api.campcreekmarket.com/step/checkout/";

      router.push(redirectUrl);
    } else {
      setPlacing(false);
      setError(result.error || "Something went wrong. Please try again.");
    }
  }

  if (!mounted) return null;
  if (cart.items.length === 0 && !placing) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Continue shopping
      </Link>

      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]"
      >
        {/* LEFT */}
        <div className="flex flex-col gap-8">

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <section>
            <h2 className="mb-4 text-base font-semibold">Contact</h2>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={setField("email")}
              className={inputClass}
            />
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold">
              Shipping address
            </h2>

            {/* Address toggle */}
            <div className="mb-6 flex gap-4">
              <button
                type="button"
                onClick={() => setAddressType("traditional")}
                className="px-4 py-2 border rounded-lg"
              >
                Traditional
              </button>

              <button
                type="button"
                onClick={() => setAddressType("rwatok")}
                className="px-4 py-2 border rounded-lg"
              >
                3 Word
              </button>
            </div>

            <input
              type="text"
              required
              placeholder="First Name"
              value={form.firstName}
              onChange={setField("firstName")}
              className={inputClass}
            />

            <input
              type="text"
              required
              placeholder="Last Name"
              value={form.lastName}
              onChange={setField("lastName")}
              className={inputClass}
            />

            {addressType === "traditional" && (
              <input
                type="text"
                required
                placeholder="Address"
                value={form.address1}
                onChange={setField("address1")}
                className={inputClass}
              />
            )}

            {addressType === "rwatok" && (
              <input
                type="text"
                required
                placeholder="keep.it.simple"
                value={form.rwatok}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    rwatok: e.target.value.replace(/^\/\/\//, ""),
                  }))
                }
                className={inputClass}
              />
            )}

            <input
              type="text"
              required
              placeholder="ZIP"
              value={form.postcode}
              onChange={setField("postcode")}
              className={inputClass}
            />
          </section>
        </div>

        {/* RIGHT */}
        <aside className="border rounded-xl p-6 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          {cart.items.map((item) => (
            <div key={item.productId} className="flex justify-between py-1 text-sm">
              <span>{item.name}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}

          <div className="border-t mt-4 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>

          <Button type="submit" disabled={placing} className="w-full mt-4">
            {placing ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </Button>

          <p className="text-xs text-muted-foreground mt-3">
            Secure checkout via WooCommerce + Stripe
          </p>
        </aside>
      </form>
    </div>
  );
}
