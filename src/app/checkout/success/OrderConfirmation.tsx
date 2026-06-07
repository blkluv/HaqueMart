"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { Button } from "@/components/ui/button";

interface Props {
  orderId: string;
}

export function OrderConfirmation({ orderId }: Props) {
  const { clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    clearCart();
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-24 text-center">
      <div className="mb-6 flex justify-center">
        <CheckCircle className="size-16 text-green-500" />
      </div>

      <h1 className="mb-3 text-2xl font-bold">Order confirmed!</h1>

      <p className="mb-2 text-muted-foreground">
        Thanks for shopping with Camp Creek Market. We&apos;ve received your order and
        will be in touch once it is ready for delivery or pickup.
      </p>

      <p className="mb-10 text-sm text-muted-foreground">
        Order reference:{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
          {orderId}
        </code>
      </p>

      <Link href="/">
        <Button size="lg" className="gap-2">
          <ShoppingBag className="size-4" />
          Continue shopping
        </Button>
      </Link>
    </div>
  );
}
