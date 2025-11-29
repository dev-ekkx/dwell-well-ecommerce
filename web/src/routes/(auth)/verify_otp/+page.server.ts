import type { AmplifyAuthResponseI } from "$lib/interfaces";
import { fail, type ActionFailure, type Actions } from "@sveltejs/kit";
import { confirmSignUp } from "aws-amplify/auth";

export const actions = {
	default: async ({
		request
	}): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		const data = await request.formData();
		const confirmationCode = data.get("otp") as string;
		const username = data.get("email") as string;
		try {
			const authResponse = await confirmSignUp({ username, confirmationCode });
			return {
				authResponse
			};
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
