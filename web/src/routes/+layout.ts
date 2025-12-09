import { AUTH_ROUTES, CMS_URL } from "$lib/constants";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, url, data, route }) => {
	const isAuthPage = AUTH_ROUTES.some((r) => url.pathname.endsWith(`/${r}`));
	try {
		if (isAuthPage || route?.id?.includes("(sales_support)")) {
			return {
				footer: null,
				homepage: null,
				isAuthenticated: data.isAuthenticated,
				countryDetails: data.countryDetails,
				user: data.user
			};
		}

		const footerData = await fetch(CMS_URL + "/api/footer?populate=all");
		// const footer = (await footerData.json()).data as FooterI;
		console.log(await footerData.json().data)

		// const homepageData = await fetch(
		// 	CMS_URL + "/api/pages?filters[slug][$eq]=homepage&populate=all"
		// );
		// // const homepage = (await homepageData.json()).data[0] as PageI;
		// const homepage = await homepageData
		// console.log(homepage)

		return {
			footer: null,
			homepage: null,
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
