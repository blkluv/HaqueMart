// lib/graphql/queries.ts

import { gql } from "graphql-request"; // or just export as strings if you're not using gql tag

export const GET_PRODUCTS = gql`
  query GET_PRODUCTS($first: Int, $after: String, $category: String) {
    products(first: $first, after: $after, where: { category: $category }) {
      nodes {
        databaseId
        name
        slug
        price
        regularPrice
        salePrice
        image {
          sourceUrl
          altText
        }
        stockStatus
        averageRating
        reviewCount
        productCategories {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GET_PRODUCT($slug: String!) {
    product(slug: $slug) {
      databaseId
      name
      slug
      description
      price
      regularPrice
      salePrice
      stockStatus
      stockQuantity
      averageRating
      reviewCount
      soldThisWeek
      badge
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
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  query GET_PRODUCT_CATEGORIES {
    productCategories(where: { hideEmpty: true }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;
