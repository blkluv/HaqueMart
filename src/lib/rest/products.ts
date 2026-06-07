const auth = Buffer.from(
  `${process.env.WOOCOMMERCE_KEY}:${process.env.WOOCOMMERCE_SECRET}`
).toString("base64");

export async function getWooProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_REST_URL}/wc/v3/products?per_page=12`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("WooCommerce API failed");
  }

  return res.json();
}
