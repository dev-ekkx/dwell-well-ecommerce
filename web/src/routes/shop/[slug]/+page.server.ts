import type { PageServerLoad } from "./$types";
import { client } from "../../../graphql.config";
import { GET_PRODUCT_BY_SLUG } from "../../../graphql.queries";
import { error } from "@sveltejs/kit";
import type { ProductI } from "$lib/interfaces";

export const load: PageServerLoad = async ({ params, url }) => {
	const opsData = Object.fromEntries(url.searchParams);
	const variables = {
		filters: {
			slug: {
				eq: params.slug
			}
		}
	};
	const strapiResult = await client.query(GET_PRODUCT_BY_SLUG, variables).toPromise();
	if (strapiResult.error) {
		error(500, `GraphQL Error: ${strapiResult.error.message}`);
	}
	const data: ProductI = { ...strapiResult.data?.products[0], ...opsData, slug: params.slug };
	const product = {
		...data,
		categories: data.categories?.map((item) => item.name),
		sizes: data.sizes?.map((item) => item.name),
		styles: data.styles?.map((item) => item.name),
		availability: data.availability.name
	};
	return {
		product
	};
};
