import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { signIn } from "@aws-amplify/auth";

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get("email");
		const password = data.get("password");

		try {
			const user = {
				username: String(email ?? ""),
				password: String(password ?? "")
			};

			return await signIn(user);
		} catch (e) {
			return fail(400, (e as Error).message);
		}
	}
} satisfies Actions;
