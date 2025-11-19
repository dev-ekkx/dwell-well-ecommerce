import { type ActionFailure, fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { confirmSignIn } from "@aws-amplify/auth";
import type { AmplifyAuthResponseI } from "$lib/interfaces";

export const actions = {
	default: async ({
		request
	}): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		const data = await request.formData();
		const password = data.get("newPassword");
		try {
			return {
				authResponse: await confirmSignIn({
					challengeResponse: String(password ?? ""),
					options: {
						userAttributes: {}
					}
				})
			};
		} catch (e) {
			return fail(400, { error: JSON.stringify(e) });
		}
	}
} satisfies Actions;
