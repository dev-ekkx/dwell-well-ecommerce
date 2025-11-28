import type { AmplifyAuthResponseI, UserAuthI } from "$lib/interfaces";
import { initialState } from "$lib/store/user-store.svelte";
import { getUserAndAuthData } from "$lib/utils";
import { signIn } from "@aws-amplify/auth";
import { type ActionFailure, fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async ({
		request,
		cookies
	}): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		const data = await request.formData();
		const email = data.get("email");
		const password = data.get("password");

		try {
			const user = {
				username: String(email ?? ""),
				password: String(password ?? "")
			};
			const authResponse = await signIn(user);
			let res: UserAuthI = initialState;
			if (authResponse.nextStep.signInStep === "DONE") {
				res = await getUserAndAuthData();
				cookies.set("authRes", JSON.stringify(res), {
					path: "/",
					httpOnly: true,
					sameSite: "lax",
					secure: true
				});
			}
			return {
				userAuth: res,
				authResponse,
				oldPassword: String(password ?? "")
			};
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
