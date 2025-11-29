import { AUTH_ROUTES } from "$lib/constants";
import type { FooterI, PageI } from "$lib/interfaces";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, url, data, route }) => {
	const isAuthPage = AUTH_ROUTES.some((r) => url.pathname.endsWith(`/${r}`));
console.log(route)
	try {
		if (isAuthPage || route?.id?.includes("(sales_support)")) {
			return {
				footer: null,
				homepage: null,
				isAuthenticated: data.isAuthenticated,
				countryDetails: data.countryDetails
			};
		}

		const footerData = await fetch(import.meta.env.VITE_CMS_URL + "/api/footer?populate=all");
		const footer = (await footerData.json()).data as FooterI;

		const homepageData = await fetch(
			import.meta.env.VITE_CMS_URL + "/api/pages?filters[slug][$eq]=homepage&populate=all"
		);
		const homepage = (await homepageData.json()).data[0] as PageI;

		return {
			footer,
			homepage,
			user: data.user,
			// auth: data.auth,
			isAuthenticated: data.isAuthenticated,
			countryDetails: data.countryDetails
		};
	} catch (error) {
		console.error("Error loading footer data: ", error);
		return {
			footer: null,
			homepage: null
		};
	}
};
