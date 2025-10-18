import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url }) => {
	const searchTerm = url.searchParams.get("q");
	const page = Number(url.searchParams.get("page") ?? "1");
	const pageSize = Number(url.searchParams.get("perPage") ?? "5");
	const sort = url.searchParams.get("sort");
	const categoriesFilter = url.searchParams.get("categories")?.split(",");
	const sizesFilter = url.searchParams.get("sizes")?.split(",");
	const stylesFilter = url.searchParams.get("style")?.split(",");

	const variables: {
		pagination: { page: number; pageSize: number };
		filters: Record<string, unknown>;
		sort?: string[];
	} = {
		pagination: { page, pageSize },
		filters: {}
	};

	// Build query variables
	if (sort) {
		variables.sort = [sort];
	}

	if (searchTerm) {
		variables.filters.name = { containsi: searchTerm };
	}
	if (categoriesFilter && categoriesFilter.length > 0) {
		variables.filters.categories = { slug: { in: categoriesFilter } };
	}
	if (sizesFilter && sizesFilter.length > 0) {
		variables.filters.size = { in: sizesFilter };
	}
	if (stylesFilter && stylesFilter.length > 0) {
		variables.filters.style = { in: stylesFilter };
	}

	console.log(variables);
};
