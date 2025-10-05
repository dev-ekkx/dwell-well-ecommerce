import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	try {
		const heroData = await fetch(import.meta.env.VITE_CMS_URL + "/api/hero?populate=all");
		const data = (await heroData.json()).data;
		console.log(data);

		return {};
	} catch (e) {
		console.error("Error fetching data from cms: ", e);
		return {};
	}
};
