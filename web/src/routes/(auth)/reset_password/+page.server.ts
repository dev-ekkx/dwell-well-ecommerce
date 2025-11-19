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
		console.log(password);
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
			const error = (e as Error).message;
			return fail(400, { error });
		}
	}
} satisfies Actions;
