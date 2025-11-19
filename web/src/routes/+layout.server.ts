import type { LayoutServerLoad } from "./$types";
import { Amplify } from "aws-amplify";
import { IDENTITY_POOL_ID, USER_CLIENT_POOL_ID, USER_POOL_ID } from "$env/static/private";

export const load: LayoutServerLoad = () => {
	Amplify.configure({
		Auth: {
			Cognito: {
				userPoolId: USER_POOL_ID,
				userPoolClientId: USER_CLIENT_POOL_ID,
				identityPoolId: IDENTITY_POOL_ID
			}
		}
	});
};
