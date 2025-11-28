import type { AmplifyAuthResponseI, UserAuthI } from "$lib/interfaces";
import { initialState } from "$lib/store/user-store.svelte";
import { getUserAndAuthData } from "$lib/utils";
import { confirmSignIn } from "@aws-amplify/auth";
import { type ActionFailure, fail } from "@sveltejs/kit";
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
				cookies.set("authRes", JSON.stringify(userAuth), {
					path: "/",
					httpOnly: true,
					sameSite: "lax",
					secure: true
				});
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
