import type { LayoutLoad } from "../../.svelte-kit/types/src/routes/$types";

export const load: LayoutLoad = async ({ fetch }) => {
	try {
		const footerData = await fetch(import.meta.env.VITE_CMS_URL + "/api/footer?populate=all");
		const data = await footerData.json();
		console.log(data);
		return {
			footer: null
		};
	} catch (error) {
		console.error("Error loading footer data: ", error);
		return {
			footer: null
		};
	}
};
