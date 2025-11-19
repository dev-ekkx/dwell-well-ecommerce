import type { LayoutLoad } from "./$types";
import type { FooterI, PageI } from "$lib/interfaces";
import { AUTH_ROUTES } from "$lib/constants";
import { Amplify } from "aws-amplify";
import { PUBLIC_USER_CLIENT_POOL_ID, PUBLIC_USER_POOL_ID } from "$env/static/public";

export const load: LayoutLoad = async ({ fetch, url }) => {
	// Configure amplify auth
	Amplify.configure({
		Auth: {
			Cognito: {
				userPoolId: PUBLIC_USER_POOL_ID,
				userPoolClientId: PUBLIC_USER_CLIENT_POOL_ID
				// identityPoolId: IDENTITY_POOL_ID
			}
		}
	});

	const isAuthPage = AUTH_ROUTES.some((r) => url.pathname.endsWith(`/${r}`));

	try {
		if (isAuthPage) {
			return {
				footer: null,
				homepage: null
			};
		}

		console.log("fetching footer and homepage data");

		const footerData = await fetch(import.meta.env.VITE_CMS_URL + "/api/footer?populate=all");
		const footer = (await footerData.json()).data as FooterI;

		const homepageData = await fetch(
			import.meta.env.VITE_CMS_URL + "/api/pages?filters[slug][$eq]=homepage&populate=all"
		);
		const homepage = (await homepageData.json()).data[0] as PageI;

		return {
			footer,
			homepage
		};
	} catch (error) {
		console.error("Error loading footer data: ", error);
		return {
			footer: null,
			homepage: null
		};
	}
};
