import type { Actions } from "./$types";
import { type ActionFailure, fail } from "@sveltejs/kit";
import { fetchAuthSession, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import type { AmplifyAuthResponseI, UserAuthI } from "$lib/interfaces";
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
			console.log("auth response: ", authResponse);
			let res: UserAuthI = initialState;
			if (authResponse.nextStep.signInStep === "DONE") {
				// res = await getUserAndAuthData();
				// console.log(res);
				// cookies.set("userAuth", JSON.stringify(res), {
				// 	path: "/",
				// 	httpOnly: true,
				// 	sameSite: "lax"
				// });
				const data = await getCurrentUser();
				const auth = await fetchAuthSession();
				console.log(data);
				console.log(auth);
			}
			return {
				// userAuth: res,
				authResponse,
				oldPassword: String(password ?? "")
			};
		} catch (e) {
			console.log(e);
			await signOut();
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
