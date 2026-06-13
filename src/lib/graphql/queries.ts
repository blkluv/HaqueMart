export const GET_PRODUCTS = `
  query GET_PRODUCTS($first: Int, $after: String, $category: String) {
    products(first: $first, after: $after, where: { category: $category }) {
      nodes {
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
  query GET_PRODUCT($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      databaseId
      name
      slug
      description

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

      averageRating
      reviewCount

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