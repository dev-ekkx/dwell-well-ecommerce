import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	try {
		const aboutData = await fetch(
			import.meta.env.VITE_CMS_URL + "/api/pages?filters[slug][$eq]=about&populate=all"
		);
		const data = (await aboutData.json()).data[0];
		console.log(data);
		return {
			about: data
		};
	} catch (err) {
		console.error("Error fetching data from cms: ", err);
		return {
			about: null
		};
	}
};
