import type { Actions } from "./$types";
import type { AmplifyAuthResponseI } from "$lib/interfaces";
import { type ActionFailure, fail } from "@sveltejs/kit";
import parsePhoneNumber, { type CountryCode } from "libphonenumber-js";

export const actions = {
	default: async ({
		request
	}): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		const data = await request.formData();
		console.log(data);
		const name = data.get("name");
		const email = data.get("email");
		const password = data.get("password");
		const phone = data.get("phone");
		const countryCode = data.get("country");

		const parsedNumber = parsePhoneNumber(phone as string, countryCode as CountryCode);
		console.log(parsedNumber);
		try {
			return {};
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
