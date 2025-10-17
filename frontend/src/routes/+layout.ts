import type { LayoutLoad } from "./$types";
import type { FooterI } from "$lib/interfaces";

export const load: LayoutLoad = async ({ fetch }) => {
	try {
		const footerData = await fetch(import.meta.env.VITE_CMS_URL + "/api/footer?populate=all");
		const data = (await footerData.json()).data as FooterI;

		return {
			footer: data
		};
	} catch (error) {
		console.error("Error loading footer data: ", error);
		return {
			footer: null
		};
	}
};
