import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { orderId, orderKey } = await request.json();
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  const auth = Buffer.from(
    `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
  ).toString("base64");

  // Mark order as paid
  const res = await fetch(`${baseUrl}/wp-json/wc/v3/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      set_paid: true,
      transaction_id: `stripe_${Date.now()}`, // optional
    }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}