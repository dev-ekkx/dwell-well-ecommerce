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
