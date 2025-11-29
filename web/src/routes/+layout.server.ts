import { IDENTITY_POOL_ID, USER_CLIENT_POOL_ID, USER_POOL_ID } from "$env/static/private";
import type { UserAuthI } from "$lib/interfaces";
import { persistSessionData } from "$lib/utils";
import { Amplify } from "aws-amplify";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, cookies, locals }) => {
	Amplify.configure({
		Auth: {
			Cognito: {
				userPoolId: USER_POOL_ID,
				userPoolClientId: USER_CLIENT_POOL_ID,
				identityPoolId: IDENTITY_POOL_ID
			}
		}
	});

	const res = await fetch("https://get.geojs.io/v1/ip/country.json");
	const countryDetails = await res.json();
	const sessionData = JSON.parse(cookies.get("session") ?? "{}") as UserAuthI;
	const session = { ...sessionData, countryDetails };

	persistSessionData(session, cookies);

	return {
		user: locals.user,
		auth: locals.auth,
		isAuthenticated: locals.isAuthenticated,
		countryDetails: session.countryDetails
	};
};
