import type { AmplifyAuthResponseI, UserAuthI } from "$lib/interfaces";
import { initialState } from "$lib/store/user-store.svelte";
import { getUserAndAuthData, persistSessionData } from "$lib/utils";
import { confirmSignIn } from "@aws-amplify/auth";
import { type ActionFailure, fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async ({
		request,
		cookies
	}): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		const data = await request.formData();
		const password = data.get("newPassword");
		try {
			const authResponse = await confirmSignIn({
				challengeResponse: String(password ?? "")
			});
			let userAuth: UserAuthI = initialState;
			if (authResponse.nextStep.signInStep === "DONE") {
				userAuth = await getUserAndAuthData();
				persistSessionData(userAuth, cookies);
				if (userAuth.user.role === "customer") {
					redirect(302, "/");
				}else {
					redirect(302, "/admin");
				}
			}
			return {
				authResponse,
				userAuth
			};
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
