import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { confirmSignIn } from "@aws-amplify/auth";

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const password = data.get("newPassword");
		console.log(password);
		try {
			// return password;
			return await confirmSignIn({
				challengeResponse: String(password ?? "")
			});
		} catch (e) {
			console.error("Error: ", (e as Error).message);
			return fail(400, (e as Error).message);
		}
	}
} satisfies Actions;