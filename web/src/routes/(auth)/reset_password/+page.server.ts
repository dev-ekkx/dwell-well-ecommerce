import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const password = data.get("newPassword");
		console.log(password);
		try {
			return password;

			// return {
			// 	response: await confirmSignIn(
			// 		{
			// 			challengeResponse: String(password ?? ""),
			// 		}
			// 	),
			// };
		} catch (e) {
			return fail(400, (e as Error).message);
		}
	}
} satisfies Actions;