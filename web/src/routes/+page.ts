import type { PageLoad } from "./$types";
import type { PageI } from "$lib/interfaces";

export const load: PageLoad = async ({ fetch }) => {
	try {
		const heroData = await fetch(
			import.meta.env.VITE_CMS_URL + "/api/pages?filters[slug][$eq]=homepage&populate=all"
		);
		const data = (await heroData.json()).data[0] as PageI;

		return {
			homepage: data
		};
	} catch (e) {
		console.error("Error fetching data from cms: ", e);
		return {
			homepage: null
		};
	}
};
