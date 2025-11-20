import type { AmplifyAuthResponseI } from "$lib/interfaces";
import { type ActionFailure, fail } from "@sveltejs/kit";
import { signOut } from "@aws-amplify/auth";
import type { Actions } from "./$types";

export const actions = {
	default: async ({
		cookies
	}): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		try {
			await signOut();
			cookies.delete("authRes", {
				path: "/"
			});
			return {
				isLogout: true
			};
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
