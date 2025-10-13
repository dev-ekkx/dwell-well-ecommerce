import type { PageLoad } from "./$types";
import { client } from "../../graphql.config";
import { GET_FILTERS } from "../../graphql.queries";
import type { FiltersI, PageI } from "$lib/interfaces";

export const load: PageLoad = async ({ fetch }) => {
	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;

	// Fetch the shop page data from the CMS
	const shopPagePromise = await fetch(
		`${cmsBaseUrl}/api/pages?filters[slug][$eq]=shop&populate=all`
	);
	const shopPageJson = await shopPagePromise.json();
	const shopData = shopPageJson.data[0] as PageI;
	if (!shopData) {
		throw new Error("Shop page not found in the CMS");
	}
	const shopPageSeo = shopData.seo;

	// Fetch filters using GraphQL
	const filtersPromise = await client.query(GET_FILTERS, {}).toPromise();

	if (filtersPromise.error) {
		throw new Error("Failed to fetch filters from CMS");
	}
	const filters = filtersPromise.data as FiltersI;
	return {
		filters,
		seo: shopPageSeo
	};
};
