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
