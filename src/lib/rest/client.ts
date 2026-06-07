const BASE = process.env.NEXT_PUBLIC_WP_REST_URL;

export async function wpRest<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE}${endpoint}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`REST API failed: ${res.status}`);
  }

  return res.json();
}
