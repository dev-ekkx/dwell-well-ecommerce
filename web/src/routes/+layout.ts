import type { LayoutLoad } from "./$types";
import type { FooterI, PageI, UserAuthI } from "$lib/interfaces";
import { AUTH_ROUTES } from "$lib/constants";
import { userStore } from "$lib/store/user-store.svelte";
import { browser } from "$app/environment";

export const load: LayoutLoad = async ({ fetch, url, data }) => {
	// Fetch user data from cookies
	if (browser) {
		const data = await cookieStore.get("userAuth");
		if (data?.value) {
			const userAuth = JSON.parse(data?.value as string) as UserAuthI;
			if (userAuth && userAuth.auth.tokenExpiry > 0) {
				await userStore.updateUserStore(userAuth);
			}
		}
	}

	const isAuthPage = AUTH_ROUTES.some((r) => url.pathname.endsWith(`/${r}`));

	try {
		if (isAuthPage) {
			return {
				footer: null,
				homepage: null
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
			userCountry: data.userCountry
		};
	} catch (error) {
		console.error("Error loading footer data: ", error);
		return {
			footer: null,
			homepage: null
		};
	}
};
