import type { Actions } from "./$types";
import { type ActionFailure, fail } from "@sveltejs/kit";
import { signIn } from "aws-amplify/auth";
import type { AmplifyAuthResponseI, UserAuthI } from "$lib/interfaces";
import { getUserAndAuthData } from "$lib/utils";
import { signOut } from "@aws-amplify/auth";
import { initialState } from "$lib/store/user-store.svelte";

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
			}
			return {
				userAuth: res,
				authResponse,
				oldPassword: String(password ?? "")
			};
		} catch (e) {
			await signOut();
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
