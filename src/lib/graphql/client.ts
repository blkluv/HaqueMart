const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || process.env.WP_GRAPHQL_URL;

if (!WP_GRAPHQL_URL) {
  throw new Error("Missing GraphQL endpoint environment variable");
}

export async function wpgql<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // optional: ISR cache
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    const firstError = json.errors[0];
    throw new Error(`GraphQL error: ${firstError.message}`);
  }

  if (!json.data) {
    throw new Error("GraphQL response missing data");
  }

  return json.data as T;
}
