import type {PageServerLoad} from "./$types";
import {GET_PRODUCTS} from "../../graphql.queries";
import {client} from "../../graphql.config";
import {error} from "@sveltejs/kit";
import type {ProductCardI} from "$lib/interfaces";
import type {ProductDataMap} from "$lib/types";


export const load: PageServerLoad = async ({ fetch, url }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
        case 'name-asc': strapiSort = 'name:asc'; break;
        case 'name-desc': strapiSort = 'name:desc'; break;
        case 'newest': strapiSort = 'publishedAt:desc'; break;
        default: strapiSort = undefined;
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
	if (priceRangeFilter) {
        const [min, max] = priceRangeFilter.split(",").map(Number);
        if (!Number.isNaN(min) && !Number.isNaN(max)) {
            try {

            const skuResponse = await fetch(
                `${backendUrl}/products/skus-by-price?minPrice=${min}&maxPrice=${max}`
            );
            if (!skuResponse.ok) error(502, "Could not fetch price-filtered SKUs");
            const priceFilteredSkus: string[] = await skuResponse.json();
            if (priceFilteredSkus.length === 0) {
                return {products: [], pagination: {total: 0}};
            }
            variables.filters.SKU = {in: priceFilteredSkus};
            }
            catch {
                error(502, "Failed to apply price filter");
            }
        }
    }

	const strapiResult = await client.query(GET_PRODUCTS, variables).toPromise();
	console.log(JSON.stringify(strapiResult.error?.graphQLErrors));
	if (strapiResult.error) {
		error(500, `GraphQL Error: ${strapiResult.error.message}`);
	}

	const totalProducts = strapiResult.data.products_connection.pageInfo.total as number;
    const productsFromStrapi = (strapiResult.data.products || []) as ProductCardI[]
    const skusToFetch = productsFromStrapi.map((product) => product.SKU)
    let productDataMap: ProductDataMap = {};
    console.log(skusToFetch);
    if (skusToFetch.length > 0) {
        const operationalDataResponse = await fetch(`${backendUrl}/products`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skus: skusToFetch })
        });


        if (!operationalDataResponse.ok) error(502, 'Failed to fetch operational product data');
        productDataMap = await operationalDataResponse.json();
    }

    let mergedProducts: ProductCardI[] = productsFromStrapi.map(item => {
        const opsProduct = productDataMap[item.SKU] || { price: 0, oldPrice: 0, averageRating: 0, reviewCount: 0 }
        return {
            ...opsProduct,
            SKU: item.SKU,
            slug: item.slug,
            images: item.images,
            name: item.name,
        }
    })

    if (sort === 'price-asc') {
        mergedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        mergedProducts.sort((a, b) => b.price - a.price);
    }
	return {
		totalProducts,
		products: mergedProducts
	};
};
