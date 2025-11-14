import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";

export const actions = {
	default: async ({ cookies, request }) => {
		// console.log("cookies: ", cookies);
		const data = await request.formData();
		const email = data.get("email");
		const password = data.get("password");

		return fail(400, "incorrect email or password");
	}
} satisfies Actions;
