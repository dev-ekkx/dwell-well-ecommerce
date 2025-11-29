import type { AmplifyAuthResponseI } from "$lib/interfaces";
import { fail, type ActionFailure, type Actions } from "@sveltejs/kit";

export const actions = {
	default: async ({
		request,
		cookies
	}): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		const data = await request.formData();
		const otp = data.get("otp");
		const username = data.get("email");
		console.log(otp);
		console.log(username);
		try {
			// const user = {
			//     username: String(email ?? ""),
			//     password: String(password ?? "")
			// };
			// const authResponse = await signIn(user);
			// let userAuth: UserAuthI = initialState;
			// if (authResponse.nextStep.signInStep === "DONE") {
			//     userAuth = await getUserAndAuthData();
			//     cookies.set("authRes", JSON.stringify(userAuth), {
			//         path: "/",
			//         httpOnly: true,
			//         sameSite: "lax",
			//         secure: true
			//     });
			// }
			return {
				// userAuth,
				// authResponse,
				// oldPassword: String(password ?? "")
			};
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
