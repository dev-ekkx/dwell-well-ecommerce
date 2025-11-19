import type { Actions } from "./$types";
import { type ActionFailure, fail } from "@sveltejs/kit";
import { signIn } from "@aws-amplify/auth";
import type { AmplifyAuthResponseI } from "$lib/interfaces";

export const actions = {
	default: async ({
		request
	}): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		const data = await request.formData();
		const email = data.get("email");
		const password = data.get("password");

		try {
			const user = {
				username: String(email ?? ""),
				password: String(password ?? "")
			};

			return {
				authResponse: await signIn(user),
				oldPassword: String(password ?? "")
			};
		} catch (e) {
			const error = (e as Error).message;
			return fail(400, { error });
		}
	}
} satisfies Actions;
