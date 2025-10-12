import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url }) => {
	const searchTerm = url.searchParams.get("q");
	console.log(searchTerm);
};
