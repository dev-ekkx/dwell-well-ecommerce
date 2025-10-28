import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, url }) => {
	console.log("route params", params);
	console.log("route url: ", url);
	const slug = params.slug;
	const productOpData = {
		price: url.searchParams.get("price"),

	};
};