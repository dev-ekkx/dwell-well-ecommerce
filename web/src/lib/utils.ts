import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import type { RouteId } from "$app/types";
import type { FetchI, ProductI, UserAuthI } from "$lib/interfaces";
import { error, type Cookies } from "@sveltejs/kit";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { clsx, type ClassValue } from "clsx";
import { marked } from "marked";
import { SvelteURLSearchParams } from "svelte/reactivity";
import { twMerge } from "tailwind-merge";
import { client } from "../graphql.config";
import { GET_PRODUCTS } from "../graphql.queries";
import { BACKEND_URL } from "./constants";
import type { ProductDataMapT } from "./types";

// SHADCN SVELTE TYPES (DON'T DELETE)
export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Formats a number by adding commas as thousands separators.
 * @param num The number to format.
 * @returns A string representation of the number with commas.
 */
export function formatNumberWithCommas(num: number): string {
	return num.toLocaleString("en-Gh");
}

export const setRouteParams = async (
	paramsToSet: Record<string, string | number>,
	noScroll = false,
	path?: string
) => {
	const currentUrl = page.url.searchParams;
	// Create a new URLSearchParams object based on the current URL's params
	const newParams = new SvelteURLSearchParams(currentUrl);

	// Iterate over the new parameters and set them
	for (const [key, value] of Object.entries(paramsToSet)) {
		if (value === null || value === undefined || value === "" || value === "[]") {
			newParams.delete(key);
		} else {
			newParams.set(key, String(value));
		}
	}

	// Construct the new URL path with the updated parameters
	const pathname = path ?? page.url.pathname;
	const queryString = newParams.toString();
	const newPath = (queryString ? `${pathname}?${queryString}` : page.url.pathname) as RouteId;

	// Navigate to the new URL
	// @ts-ignore
	await goto(resolve(newPath), {
		replaceState: true,
		keepFocus: true,
		noScroll
	});
};

marked.setOptions({
	gfm: true,
	breaks: true,
	pedantic: false
});

export async function renderMarkdown(text: string) {
	if (!text) return "No content";
	const markdown = text.replace(/\\n/g, "\n");
	const dirty = await marked.parse(markdown);

	// Only sanitize in the browser (client side)
	if (globalThis.window !== undefined) {
		const DOMPurify = (await import("dompurify")).default;
		return DOMPurify.sanitize(dirty);
	}

	// Return the raw HTML on the server
	return typeof dirty;
}

export const createInitial = (userName: string): string => {
	if (!userName?.trim()) return "N/A";

	const parts = userName.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const second = parts.at(-1)?.[0] ?? "";

	const initials = `${first}${second}`.toUpperCase();
	return initials || "N/A";
};

export const checkTokenExpiry = (expiry: number) => {
	const currentTime = Math.floor(Date.now() / 1000);
	return currentTime > expiry;
};

export const getUserAndAuthData = async () => {
	const [authSession, currentUser] = await Promise.all([fetchAuthSession(), getCurrentUser()]);

	const userInfo = authSession?.tokens?.idToken?.payload ?? {};
	const accessToken = authSession.tokens?.accessToken?.toString();
	const idToken = authSession.tokens?.idToken?.toString();
	const user: UserAuthI["user"] = {
		userId: currentUser?.userId ?? "",
		name: userInfo["name"] ?? "",
		email: userInfo["email"] ?? "",
		phone: userInfo["phone_number"] ?? "",
		role: Array.isArray(userInfo["cognito:groups"])
			? (userInfo["cognito:groups"]?.[0] ?? "customer")
			: "customer"
	} as UserAuthI["user"];

	return {
		user,
		auth: {
			accessToken,
			idToken,
			tokenExpiry: userInfo.exp ?? 0
		}
	};
};

export const persistSessionData = (userAuth: UserAuthI, cookies: Cookies) => {
	cookies.set("session", JSON.stringify(userAuth), {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: true
	});
};

/*
export const fetchAndTransformProducts = async ({
	fetch,
	sort,
	page,
	pageSize,
	searchTerm,
	categoriesFilter,
	sizesFilter,
	stylesFilter,
	availabilitiesFilter,
	priceRangeFilter
}: {
	fetch: FetchI;
	searchTerm: string | null;
	page: number;
	pageSize: number;
	sort: string | null;
	categoriesFilter: string[] | undefined;
	sizesFilter: string[] | undefined;
	stylesFilter: string[] | undefined;
	availabilitiesFilter: string[] | undefined;
	priceRangeFilter: string | null;
}) => {
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
		default:
			strapiSort = undefined;
	}

	const variables: {
		pagination: { page: number; pageSize: number };
		filters: Record<string, unknown>;
		productsConnectionFilters2: Record<string, unknown>;
		sort?: string[];
	} = {
		pagination: { page, pageSize },
		filters: {},
		productsConnectionFilters2: {}
	};

	// Build query variables
	if (strapiSort) variables.sort = [strapiSort];

	const allProductFilters: Record<string, unknown>[] = [];
	if (searchTerm) {
		const searchBlock = {
			or: [{ name: { containsi: searchTerm } }, { categories: { name: { containsi: searchTerm } } }]
		};
		allProductFilters.push(searchBlock);
	}

	// Add all other filters as separate "and" conditions
	if (categoriesFilter?.length) {
		allProductFilters.push({ categories: { slug: { in: categoriesFilter } } });
	}
	if (sizesFilter?.length) {
		allProductFilters.push({ sizes: { slug: { in: sizesFilter } } });
	}
	if (stylesFilter?.length) {
		allProductFilters.push({ styles: { slug: { in: stylesFilter } } });
	}
	if (availabilitiesFilter?.length) {
		allProductFilters.push({ availability: { slug: { in: availabilitiesFilter } } });
	}

	// 4. Orchestrate Price Filter
	if (priceRangeFilter) {
		const [min, max] = priceRangeFilter.split("-").map(Number);
		if (!isNaN(min) && !isNaN(max)) {
			try {
				const skuResponse = await fetch(
					`${BACKEND_URL}/products/skus-by-price?minPrice=${min}&maxPrice=${max}`
				);
				if (!skuResponse.ok) error(502, "Could not fetch price-filtered SKUs");
				const priceFilteredSkus: string[] = await skuResponse.json();
				if (priceFilteredSkus.length === 0) {
					return { products: [], pagination: { total: 0 } };
				}
				// Add the SKU filter to the main list of filters
				allProductFilters.push({ sku: { in: priceFilteredSkus } });
			} catch (e) {
				console.error("Price filter fetch failed:", e);
				error(500, "Failed to apply price filter");
			}
		}
	}

	// Set the final filters object
	if (allProductFilters.length > 0) {
		variables.filters = { and: allProductFilters };
		variables.productsConnectionFilters2 = { and: allProductFilters };
	}

	const strapiResult = await client.query(GET_PRODUCTS, variables).toPromise();

	if (strapiResult.error) {
		error(500, `GraphQL Error: ${strapiResult.error.message}`);
	}

	const totalProducts = strapiResult.data.products_connection.pageInfo.total as number;
	const productsFromStrapi = (strapiResult.data.products || []) as ProductI[];
	const skusToFetch = productsFromStrapi.map((product) => product.SKU);
	let productDataMap: ProductDataMapT = {};
	if (skusToFetch.length > 0) {
		try {
			const operationalDataResponse = await fetch(`${BACKEND_URL}/products`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ skus: skusToFetch })
			});

			if (!operationalDataResponse.ok) error(502, "Failed to fetch operational product data");
			productDataMap = await operationalDataResponse.json();
		} catch {
			console.error("Error fetching operational product data");
			// error(502, "Failed to fetch operational product data");
		}
	}

	let mergedProducts = productsFromStrapi.map((item) => {
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

	if (sort === "price-asc") {
		mergedProducts.sort((a, b) => a.price - b.price);
	} else if (sort === "price-desc") {
		mergedProducts.sort((a, b) => b.price - a.price);
	}

	return { totalProducts, products: mergedProducts };
}
*/

const mapSortToStrapi = (sort: string | null): string[] | undefined => {
	switch (sort) {
		case "name-asc":
			return ["name:asc"];
		case "name-desc":
			return ["name:desc"];
		case "newest":
			return ["publishedAt:desc"];
		default:
			return undefined;
	}
};

const buildStrapiFilters = (
	searchTerm: string | null,
	categoriesFilter: string[] | undefined,
	sizesFilter: string[] | undefined,
	stylesFilter: string[] | undefined,
	availabilitiesFilter: string[] | undefined,
	priceFilteredSkus: string[] | undefined
) => {
	const filters: Record<string, unknown>[] = [];

	// Search term filter
	if (searchTerm) {
		filters.push({
			or: [{ name: { containsi: searchTerm } }, { categories: { name: { containsi: searchTerm } } }]
		});
	}

	// Attribute filters
	if (categoriesFilter?.length) filters.push({ categories: { slug: { in: categoriesFilter } } });
	if (sizesFilter?.length) filters.push({ sizes: { slug: { in: sizesFilter } } });
	if (stylesFilter?.length) filters.push({ styles: { slug: { in: stylesFilter } } });
	if (availabilitiesFilter?.length)
		filters.push({ availability: { slug: { in: availabilitiesFilter } } });

	// SKU filter from price range
	if (priceFilteredSkus?.length) filters.push({ sku: { in: priceFilteredSkus } });

	return filters.length > 0 ? { and: filters } : {};
};

export const fetchAndTransformProducts = async ({
	fetch,
	sort,
	page,
	pageSize,
	searchTerm,
	categoriesFilter,
	sizesFilter,
	stylesFilter,
	availabilitiesFilter,
	priceRangeFilter
}: {
	fetch: FetchI;
	searchTerm: string | null;
	page: number;
	pageSize: number;
	sort: string | null;
	categoriesFilter: string[] | undefined;
	sizesFilter: string[] | undefined;
	stylesFilter: string[] | undefined;
	availabilitiesFilter: string[] | undefined;
	priceRangeFilter: string | null;
}) => {
	// Price Filter Pre-Check and SKU Fetch
	let priceFilteredSkus: string[] | undefined;

	if (priceRangeFilter) {
		const [minStr, maxStr] = priceRangeFilter.split("-");
		const min = Number(minStr);
		const max = Number(maxStr);

		if (!isNaN(min) && !isNaN(max)) {
			try {
				const skuUrl = `${BACKEND_URL}/products/skus-by-price?minPrice=${min}&maxPrice=${max}`;
				const skuResponse = await fetch(skuUrl);

				if (!skuResponse.ok) {
					error(502, "Could not fetch price-filtered SKUs");
				}

				priceFilteredSkus = await skuResponse.json();

				// Early exit: If no SKUs match the price filter, we know the final result is empty.
				if (priceFilteredSkus?.length === 0) {
					return { products: [], totalProducts: 0 };
				}
			} catch (e) {
				console.error("Price filter fetch failed:", e);
				error(500, "Failed to apply price filter");
			}
		}
	}

	// Build GraphQL Variables
	const strapiSort = mapSortToStrapi(sort);
	const filters = buildStrapiFilters(
		searchTerm,
		categoriesFilter,
		sizesFilter,
		stylesFilter,
		availabilitiesFilter,
		priceFilteredSkus
	);

	const variables: {
		pagination: { page: number; pageSize: number };
		filters: Record<string, unknown>;
		productsConnectionFilters2: Record<string, unknown>;
		sort?: string[];
	} = {
		pagination: { page, pageSize },
		filters,
		productsConnectionFilters2: filters
	};

	if (strapiSort) variables.sort = strapiSort;

	// Fetch Products (Strapi)
	const strapiResult = await client.query(GET_PRODUCTS, variables).toPromise();

	if (strapiResult.error) {
		error(500, `GraphQL Error: ${strapiResult.error.message}`);
	}

	const totalProducts = strapiResult.data.products_connection.pageInfo.total as number;
	const productsFromStrapi: ProductI[] = strapiResult.data.products || [];
	const skusToFetch = productsFromStrapi.map((product) => product.SKU);

	if (skusToFetch.length === 0) {
		return { products: [], totalProducts };
	}

	// Fetch Operational Data (Concurrent API Call)
	let productDataMap: ProductDataMapT = {};

	try {
		const operationalDataResponse = await fetch(`${BACKEND_URL}/products`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ skus: skusToFetch })
		});
		if (!operationalDataResponse.ok) {
			// Log the error but continue with default data if possible,
			// or re-throw an error if the data is essential.
			// Keeping the original implementation's leniency here.
			console.error(
				"Failed to fetch operational product data: " + operationalDataResponse.statusText
			);
		} else {
			productDataMap = await operationalDataResponse.json();
		}
	} catch (e) {
		console.error("Error fetching operational product data: " + (e as Error).message);
	}

	// Transform and Merge Data
	let mergedProducts = productsFromStrapi.map((item) => {
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

	// Client-Side Price Sort (Required because Strapi only sorts by name/date)
	if (sort === "price-asc") {
		mergedProducts.sort((a, b) => a.price - b.price);
	} else if (sort === "price-desc") {
		mergedProducts.sort((a, b) => b.price - a.price);
	}

	return { totalProducts, products: mergedProducts };
};
