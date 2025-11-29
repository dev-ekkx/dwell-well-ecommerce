import type { AmplifyAuthResponseI } from "$lib/interfaces";
import { type ActionFailure, fail } from "@sveltejs/kit";
import { type SignUpInput } from "aws-amplify/auth";
import parsePhoneNumber, { type CountryCode } from "libphonenumber-js";
import type { Actions } from "./$types";

export const actions = {
	default: async ({
		request,
		cookies
	}): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		const data = await request.formData();
		const name = String(data.get("name") ?? "");
		const email = String(data.get("email") ?? "");
		const password = String(data.get("password") ?? "");
		const phone = String(data.get("phone") ?? "");
		const countryCode = data.get("country") as CountryCode;

		const parsedNumber = parsePhoneNumber(phone, countryCode);
		const phone_number = parsedNumber?.number ?? "";

		const user: SignUpInput = {
			username: email,
			password,
			options: {
				userAttributes: {
					email,
					phone_number,
					name
				}
			}
		};

		try {
			// const authResponse = await signUp(user);
			// let userAuth: UserAuthI = initialState;
			// if (authResponse.nextStep.signUpStep === "DONE") {
			// 	userAuth = await getUserAndAuthData();
			// 	cookies.set("authRes", JSON.stringify(userAuth), {
			// 		path: "/",
			// 		httpOnly: true,
			// 		sameSite: "lax",
			// 		secure: true
			// 	});
			// }
			// return { authResponse, userAuth };
			return {};
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
