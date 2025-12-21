import { BACKEND_URL } from "$lib/constants";
import type { FetchI, UserAuthI } from "$lib/interfaces";
import { fetchAndTransformProducts } from "$lib/utils";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
const rawSession = cookies.get("session");
if (!rawSession) throw redirect(302, "/login");

const session = JSON.parse(rawSession) as UserAuthI;
const token = session?.auth?.accessToken;
	const searchTerm = url.searchParams.get("q");
	const page = Number(url.searchParams.get("page") ?? "1");
	const pageSize = Number(url.searchParams.get("perPage") ?? "10");
	const sort = url.searchParams.get("sort");
	const categoriesFilter = url.searchParams.get("categories")?.split(",").filter(Boolean);
	const sizesFilter = url.searchParams.get("sizes")?.split(",").filter(Boolean);
	const stylesFilter = url.searchParams.get("styles")?.split(",").filter(Boolean);
	const availabilitiesFilter = url.searchParams.get("availabilities")?.split(",").filter(Boolean);
	const priceRangeFilter = url.searchParams.get("priceRange");

	const productsData = await fetchAndTransformProducts({
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

	const res = await fetchProductsStatistics(fetch, String(token ?? ""))
	const stats = await res.json();
	console.log("stats: ", stats);

	return {
		productsData,
	};
};




export const actions = {
	updatePrice: async ({ request, fetch }) => {
		const formData = await request.formData();
		const sku = formData.get("sku") as string;
		const newPrice = Number(formData.get("newPrice"));

		console.log("form data: ", formData);

		try {
			const res = await fetch(`${BACKEND_URL}/products/update-price`, {
				method: "POST",
				body: JSON.stringify({ newPrice, sku })
			});

			console.log("response: ", res);

			return;
		} catch (error) {
			console.log("error: ", error);
			return fail(400, { error: (error as Error).message });
		}
	}
};



function fetchProductsStatistics(fetch: FetchI, token: string) {
	return fetch(`${BACKEND_URL}/products/stats`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		}
	});
}