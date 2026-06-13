export const GET_PRODUCTS = `
  query GET_PRODUCTS($first: Int, $after: String, $category: String) {
    products(first: $first, after: $after, where: { category: $category }) {
      nodes {
        databaseId
        name
        slug
        __typename

        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }

        ... on VariableProduct {
          price
          regularPrice
          salePrice
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
      __typename

      ... on SimpleProduct {
        price
        regularPrice
        salePrice
      }

      ... on VariableProduct {
        price
        regularPrice
        salePrice
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
