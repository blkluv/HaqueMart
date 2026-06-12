// Use raw strings – no gql tag needed unless you have a parser
export const GET_PRODUCTS = `
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

export const GET_PRODUCT = `
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

export const GET_PRODUCT_CATEGORIES = `
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
