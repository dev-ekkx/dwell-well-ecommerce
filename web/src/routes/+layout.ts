import type { LayoutLoad } from "./$types";
import type { FooterI, PageI } from "$lib/interfaces";

export const load: LayoutLoad = async ({ fetch }) => {
	try {
		const footerData = await fetch(import.meta.env.VITE_CMS_URL + "/api/footer?populate=all");
		const footer = (await footerData.json()).data as FooterI;

		const homepageData = await fetch(
			import.meta.env.VITE_CMS_URL + "/api/pages?filters[slug][$eq]=homepage&populate=all"
		);
		const homepage = (await homepageData.json()).data[0] as PageI;

		return {
			footer,
			homepage
		};
	} catch (error) {
		console.error("Error loading footer data: ", error);
		return {
			footer: null,
			homepage: null
		};
	}
};
