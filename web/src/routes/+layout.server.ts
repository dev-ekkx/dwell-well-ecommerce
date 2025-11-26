import type { LayoutServerLoad } from "./$types";
import { Amplify } from "aws-amplify";
import { IDENTITY_POOL_ID, USER_CLIENT_POOL_ID, USER_POOL_ID } from "$env/static/private";

export const load: LayoutServerLoad = async () => {
	Amplify.configure({
		Auth: {
			Cognito: {
				userPoolId: USER_POOL_ID,
				userPoolClientId: USER_CLIENT_POOL_ID,
				identityPoolId: IDENTITY_POOL_ID
			}
		}
	});

	const userCountry = await fetchUserCountry();
	return {
		userCountry
	};
};

const fetchUserCountry = async () => {
	const res = await fetch("https://get.geojs.io/v1/ip/country.json");
	return await res.json();
};
