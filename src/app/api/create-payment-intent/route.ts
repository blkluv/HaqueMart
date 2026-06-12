import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { orderId, orderKey } = await request.json();
  // In production, you’d fetch order total from WooCommerce here
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000, // replace with actual order total (in cents)
    currency: "usd",
    metadata: { orderId, orderKey },
  });
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}