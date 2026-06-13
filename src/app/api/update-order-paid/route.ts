import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Only extract what we need (removed orderKey)
    const { orderId } = await request.json();

    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!baseUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    // 1. GET current order status
    const getRes = await fetch(`${baseUrl}/wp-json/wc/v3/orders/${orderId}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    if (!getRes.ok) {
      const errText = await getRes.text();
      return NextResponse.json(
        { error: `Order not found: ${errText}` },
        { status: getRes.status }
      );
    }

    const order = await getRes.json();

    // 2. If already processing or completed, treat as success
    const paidStatuses = ["processing", "completed"];
    if (paidStatuses.includes(order.status)) {
      console.log(`Order ${orderId} already in status "${order.status}" — no update needed.`);
      return NextResponse.json({ success: true });
    }

    // 3. Update to processing
    const updateRes = await fetch(`${baseUrl}/wp-json/wc/v3/orders/${orderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "processing",
        transaction_id: `stripe_${Date.now()}`,
      }),
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      return NextResponse.json(
        { error: `WooCommerce update failed: ${errText}` },
        { status: updateRes.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {   // ✅ Use `unknown` instead of `any`
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}