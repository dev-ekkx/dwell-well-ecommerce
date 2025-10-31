import { gql } from "@urql/svelte";

export const GET_SHOWROOMS_QUERY = gql`
	query Showrooms {
		showrooms {
			country {
				region {
					name
				}
				name
			}
			image {
				url
			}
		}
	}
`;

export const GET_FILTERS = gql`
	query Filters {
		categories {
			name
			slug
		}
		styles {
			name
			slug
		}
		sizes {
			name
			slug
		}
		availabilities {
			name
			slug
		}
	}
`;

export const GET_PRODUCTS = gql`
	query GetPaginatedProducts(
		$pagination: PaginationArg
		$sort: [String]
		$filters: ProductFiltersInput
		$productsConnectionFilters2: ProductFiltersInput
	) {
		products(pagination: $pagination, sort: $sort, filters: $filters) {
			SKU
			name
			slug
			images(pagination: { limit: 1 }) {
				alternativeText
				url
			}
			categories {
				slug
			}
		}
		products_connection(filters: $productsConnectionFilters2) {
			pageInfo {
				total
			}
		}
	}
`;

export const GET_PRODUCT_BY_SLUG = gql`
	query Products($pagination: PaginationArg, $filters: ProductFiltersInput) {
		products(pagination: $pagination, filters: $filters) {
			SKU
			availability {
				name
			}
			categories {
				name
				slug
			}
			description
			images(pagination: { limit: 6 }) {
				alternativeText
				url
			}
			name
			sizes {
				name
			}
			styles {
				name
			}
			colors {
				hex_code
			}
			details
			specifications
		}
	}
`;

export const GET_RELATED_PRODUCTS = gql`
	query GetRelatedProducts($filters: ProductFiltersInput) {
		products(filters: $filters, pagination: { limit: 5 }, sort: "publishedAt:desc") {
			slug
			name
			SKU
			images(pagination: { limit: 1 }) {
				alternativeText
				url
			}
			categories {
				slug
			}
		}
	}
`;
