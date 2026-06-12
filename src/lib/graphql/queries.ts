// src/lib/graphql/queries.ts

export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts($first: Int, $after: String, $category: String) {
    products(first: $first, after: $after, where: { category: $category }) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
        }
        image {
          sourceUrl
          altText
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
        averageRating
        reviewCount
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_PRODUCT = /* GraphQL */ `
  query GetProduct($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      shortDescription
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
        stockQuantity
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        stockStatus
        stockQuantity
        variations {
          nodes {
            id
            databaseId
            name
            stockStatus
            stockQuantity
          }
        }
      }
      ... on ExternalProduct {
        price
        regularPrice
        salePrice
        stockStatus
        externalUrl
        buttonText
      }
      ... on GroupProduct {
        price
        regularPrice
        salePrice
        stockStatus
        groupedProducts {
          nodes {
            id
            name
          }
        }
      }
      # Add any other product types you have (e.g., BookingProduct, Subscription)
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
      averageRating
      reviewCount
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = /* GraphQL */ `
  query GetProductCategories {
    productCategories(first: 20, where: { hideEmpty: true }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;
