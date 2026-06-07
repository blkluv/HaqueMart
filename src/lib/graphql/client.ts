const endpoint = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL ?? "";

export function isWpConfigured(): boolean {
  return Boolean(endpoint);
}

export async function wpgql<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate = 60,
): Promise<T> {
  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_WP_GRAPHQL_URL is not configured");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "GraphQL error");
  }

  if (!json.data) {
    throw new Error("No data returned from WPGraphQL");
  }

  return json.data;
}
