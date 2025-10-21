import type { PageServerLoad } from "./$types";
import { GET_PRODUCTS } from "../../graphql.queries";
import { client } from "../../graphql.config";
import { error } from "@sveltejs/kit";
import type { ProductCardI } from "$lib/interfaces";

export const load: PageServerLoad = async ({ fetch, url }) => {
	const searchTerm = url.searchParams.get("q");
	const page = Number(url.searchParams.get("page") ?? "1");
	const pageSize = Number(url.searchParams.get("perPage") ?? "5");
	const sort = url.searchParams.get("sort");
	const categoriesFilter = url.searchParams.get("categories")?.split(",").filter(Boolean);
	const sizesFilter = url.searchParams.get("sizes")?.split(",").filter(Boolean);
	const stylesFilter = url.searchParams.get("style")?.split(",").filter(Boolean);
	const availabilitiesFilter = url.searchParams.get("availabilities")?.split(",").filter(Boolean);
	const priceRangeFilter = url.searchParams.get("priceRange");

	let strapiSort: string | undefined;
	switch (sort) {
		case "name-asc":
			strapiSort = "name:asc";
			break;
		case "name-desc":
			strapiSort = "name:desc";
			break;
		case "newest":
			strapiSort = "publishedAt:desc";
			break;
		// Price sorting will be handled later in JavaScript
		default:
			strapiSort = undefined;
	}

	const variables: {
		pagination: { page: number; pageSize: number };
		filters: Record<string, unknown>;
		sort?: string[];
	} = {
		pagination: { page, pageSize },
		filters: {}
	};

	// Build query variables
	if (strapiSort) variables.sort = [strapiSort];
	if (searchTerm) variables.filters.name = { containsi: searchTerm };
	if (categoriesFilter?.length) variables.filters.categories = { slug: { in: categoriesFilter } };
	if (sizesFilter?.length) variables.filters.sizes = { slug: { in: sizesFilter } };
	if (stylesFilter?.length) variables.filters.styles = { slug: { in: stylesFilter } };
	if (availabilitiesFilter?.length) {
		variables.filters.availability = { in: availabilitiesFilter };
	}
	const goBackendUrl = "http://your-go-backend";
	console.log(priceRangeFilter);
	if (priceRangeFilter) {
		const [min, max] = priceRangeFilter.split("-").map(Number);
		if (!Number.isNaN(min) && !Number.isNaN(max)) {
			const skuResponse = await fetch(
				`${goBackendUrl}/api/products/skus-by-price?minPrice=${min}&maxPrice=${max}`
			);
			if (!skuResponse.ok) error(502, "Could not fetch price-filtered SKUs");
			const priceFilteredSkus: string[] = await skuResponse.json();
			if (priceFilteredSkus.length === 0) {
				// If no products match the price, we can stop early.
				return { products: [], pagination: { total: 0 } };
			}
			// Add the SKU filter to the main GraphQL query.
			// This tells Strapi to only
			// fetch content for products that are in our price-filtered list.
			variables.filters.sku = { in: priceFilteredSkus };
		}
	}

	const strapiResult = await client.query(GET_PRODUCTS, variables).toPromise();
	console.log(JSON.stringify(strapiResult.error?.graphQLErrors));
	if (strapiResult.error) {
		error(500, `GraphQL Error: ${strapiResult.error.message}`);
	}

	const totalProducts = strapiResult.data.products_connection.pageInfo.total as number;

	return {
		totalProducts,
		products: strapiResult.data.products as ProductCardI[]
	};
};
