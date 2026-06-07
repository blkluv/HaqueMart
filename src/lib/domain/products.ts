import { graphqlRequest } from "@/lib/api/client";

export async function getProducts({
  first = 12,
  category,
  search,
}: {
  first?: number;
  category?: string;
  search?: string;
}) {
  const data = await graphqlRequest<any>(
    `
    query GetProducts($first: Int!, $search: String) {
      products(first: $first, where: { search: $search }) {
        nodes {
          id
          name
          slug
          price
          image {
            sourceUrl
            altText
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    `,
    { first, search }
  );

  const products = data?.data?.products;

  return {
    nodes: products?.nodes ?? [],
    hasNextPage: products?.pageInfo?.hasNextPage ?? false,
    endCursor: products?.pageInfo?.endCursor ?? null,
  };
}