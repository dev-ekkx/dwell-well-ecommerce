import { fetchAndTransformProducts } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url }) => {
	const searchTerm = url.searchParams.get("q");
	const page = Number(url.searchParams.get("page") ?? "1");
	const pageSize = Number(url.searchParams.get("perPage") ?? "10");
	const sort = url.searchParams.get("sort");
	const categoriesFilter = url.searchParams.get("categories")?.split(",").filter(Boolean);
	const sizesFilter = url.searchParams.get("sizes")?.split(",").filter(Boolean);
	const stylesFilter = url.searchParams.get("styles")?.split(",").filter(Boolean);
	const availabilitiesFilter = url.searchParams.get("availabilities")?.split(",").filter(Boolean);
	const priceRangeFilter = url.searchParams.get("priceRange");

	const { totalProducts, products } = await fetchAndTransformProducts({
		fetch,
		searchTerm,
		page,
		pageSize,
		sort,
		categoriesFilter,
		sizesFilter,
		stylesFilter,
		availabilitiesFilter,
		priceRangeFilter
	});

	return {
		totalProducts,
		products
	};
};
