export const GET_PRODUCTS = `
  query GET_PRODUCTS($first: Int, $after: String, $category: String) {
    products(
      first: $first
      after: $after
      where: { category: $category }
    ) {
      nodes {
        databaseId
        name
        slug

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
      shortDescription

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

      averageRating
      reviewCount

      productCategories {
        nodes {
          name
          slug
        }
      }

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