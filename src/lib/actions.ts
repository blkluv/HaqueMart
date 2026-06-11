"use server";

import { isWpConfigured } from "./graphql/client";
import { getProducts } from "./graphql/products";
import type { ProductListItem } from "@/types";

// ── Existing: load more products ────────────────────────────────────────────
interface LoadMoreResult {
  nodes: ProductListItem[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export async function fetchMoreProducts(
  cursor: string,
  category?: string,
): Promise<LoadMoreResult> {
  if (!isWpConfigured()) {
    return { nodes: [], hasNextPage: false, endCursor: null };
  }
  try {
    return await getProducts({ first: 12, after: cursor, category });
  } catch {
    return { nodes: [], hasNextPage: false, endCursor: null };
  }
}

// ── New: place a WooCommerce order ───────────────────────────────────────────
interface OrderItem {
  productId: number;
  quantity: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
}

export async function placeOrder(
  items: OrderItem[],
  shipping: ShippingAddress,
): Promise<
  | { success: true; orderId: number; orderKey: string }
  | { success: false; error: string }
> {
  if (!items.length) {
    return { success: false, error: "No items in cart" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!baseUrl || !consumerKey || !consumerSecret) {
    console.error("Missing WooCommerce API credentials");
    return { success: false, error: "Server configuration error" };
  }

  // Build line items for WooCommerce
  const line_items = items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
  }));

  // ⚠️ Change 'payment_method' to the slug of your installed gateway (e.g., 'stripe', 'paypal', 'cod').
  // Using 'stripe' here so the order redirects to the Stripe payment page.
  const payload = {
    payment_method: "stripe",
    payment_method_title: "Credit Card (Stripe)",
    set_paid: false,
    billing: {
      first_name: shipping.firstName,
      last_name: shipping.lastName,
      address_1: shipping.address1,
      address_2: shipping.address2 || "",
      city: shipping.city,
      state: shipping.state,
      postcode: shipping.postcode,
      country: shipping.country,
      email: shipping.email,
    },
    shipping: {
      first_name: shipping.firstName,
      last_name: shipping.lastName,
      address_1: shipping.address1,
      address_2: shipping.address2 || "",
      city: shipping.city,
      state: shipping.state,
      postcode: shipping.postcode,
      country: shipping.country,
    },
    line_items,
  };

  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const url = `${baseUrl}/wp-json/wc/v3/orders`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("WooCommerce order creation failed:", errData);
      return { success: false, error: errData?.message || "Order creation failed" };
    }

    const order = await res.json();
    return {
      success: true,
      orderId: order.id,
      orderKey: order.order_key,   // ← essential for the payment page URL
    };
  } catch (error) {
    console.error("Order creation error:", error);
    return { success: false, error: "Network error – please try again" };
  }
}