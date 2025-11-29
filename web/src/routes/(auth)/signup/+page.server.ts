import type { AmplifyAuthResponseI, UserAuthI } from "$lib/interfaces";
import { initialState } from "$lib/store/user-store.svelte";
import { getUserAndAuthData, persistSessionData } from "$lib/utils";
import { type ActionFailure, fail } from "@sveltejs/kit";
import { signUp, type SignUpInput } from "aws-amplify/auth";
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
			const authResponse = await signUp(user);
			let userAuth: UserAuthI = initialState;
			if (authResponse.nextStep.signUpStep === "DONE") {
				userAuth = await getUserAndAuthData();
				persistSessionData(userAuth, cookies);
			}
			return { authResponse, userAuth };
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
