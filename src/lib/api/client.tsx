const WP_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL!;

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const res = await fetch(WP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),

    // ⚡ critical caching layer
    cache: "force-cache",
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`GraphQL error: ${res.status}`);
  }

  return res.json();
}