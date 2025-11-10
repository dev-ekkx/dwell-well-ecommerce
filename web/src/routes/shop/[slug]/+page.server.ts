import type { PageServerLoad } from "./$types";
import { client } from "../../../graphql.config";
import { GET_PRODUCT_BY_SLUG, GET_RELATED_PRODUCTS } from "../../../graphql.queries";
import { error } from "@sveltejs/kit";
import type { ProductI, ProductSummaryI } from "$lib/interfaces";
import type { ProductDataMap } from "$lib/types";
import { BACKEND_URL } from "$lib/constants";

export const load: PageServerLoad = async ({ params, url }) => {
	const opsData = Object.fromEntries(url.searchParams);
	const variables = {
		filters: {
			slug: {
				eq: params.slug
			}
		}
	};

	// Fetch product details
	const strapiResult = await client.query(GET_PRODUCT_BY_SLUG, variables).toPromise();
	if (strapiResult.error) {
		error(500, `GraphQL Error: ${strapiResult.error.message}`);
	}
	const data: ProductI = { ...strapiResult.data?.products[0], ...opsData, slug: params.slug };
	const product = {
		...data,
		categories: data.categories?.map((item) => item.name),
		sizes: data.sizes?.map((item) => item.name),
		styles: data.styles?.map((item) => item.name),
		availability: data.availability.name
	} as ProductSummaryI;
	const categorySlugs = data.categories?.map((cat) => cat.slug) || [];

	// Fetch related products
	let relatedProducts: ProductI[] = [];
	if (categorySlugs.length > 0) {
		const relatedVariables = {
			filters: {
				slug: { ne: params.slug },
				categories: { slug: { in: categorySlugs } }
			}
		};
		const relatedResult = await client.query(GET_RELATED_PRODUCTS, relatedVariables).toPromise();
		if (relatedResult.error) {
			error(500, `GraphQL Error: ${relatedResult.error.message}`);
		}
		relatedProducts = relatedResult.data?.products || [];
	}

	let productDataMap: ProductDataMap = {};
	const skusToFetch = relatedProducts.map((prod) => prod.SKU);
	if (skusToFetch.length > 0) {
		try {
			const response = await fetch(`${BACKEND_URL}/products`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ skus: skusToFetch })
			});
			if (!response.ok) {
				error(502, `Failed to fetch related operational product data`);
			}
			productDataMap = await response.json();
		} catch {
			console.error("Error fetching operational product data");
			// error(502, "Failed to fetch operational product data");
		}
	}

	let mergedProducts = relatedProducts.map((item) => {
		const opsProduct = productDataMap[item.SKU] || {
			price: 0,
			averageRating: 0,
			reviewCount: 0,
			inventory: 0
		};
		return {
			...opsProduct,
			SKU: item.SKU,
			slug: item.slug,
			images: item.images,
			name: item.name
		};
	}) as ProductI[];

	return {
		product,
		relatedProducts: mergedProducts
	};
};
