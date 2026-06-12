// src/app/checkout/payment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentForm({
  orderId,
  orderKey,
}: {
  orderId: string;
  orderKey: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order=${orderId}`,
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message!);
      setProcessing(false);
    } else {
      try {
        const res = await fetch("/api/update-order-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, orderKey }),
        });
        if (res.ok) {
          router.push(`/checkout/success?order=${orderId}`);
        } else {
          setError(
            "Payment succeeded but order update failed. Please contact support."
          );
        }
      } catch {
        setError("Network error. Please contact support.");
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-16 max-w-lg rounded-xl border p-8 shadow-sm"
    >
      <h2 className="mb-6 text-2xl font-bold">Complete your payment</h2>
      <PaymentElement />
      {error && <div className="mt-4 text-sm text-red-500">{error}</div>}
      <Button
        type="submit"
        className="mt-6 w-full gap-2"
        disabled={!stripe || processing}
        size="lg"
      >
        {processing && <Loader2 className="size-4 animate-spin" />}
        Pay now
      </Button>
    </form>
  );
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const orderKey = searchParams.get("key");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !orderKey) {
      setLoadingError("Invalid payment link.");
      return;
    }

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, orderKey }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setLoadingError(data.error || "Failed to initialize payment.");
        }
      })
      .catch((err) => {
        console.error(err);
        setLoadingError("Network error. Please try again.");
      });
  }, [orderId, orderKey]);

  if (loadingError) {
    return (
      <div className="mt-20 text-center">
        <p className="text-red-500">{loadingError}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          Go back
        </Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="mt-20 flex justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm orderId={orderId!} orderKey={orderKey!} />
    </Elements>
  );
}