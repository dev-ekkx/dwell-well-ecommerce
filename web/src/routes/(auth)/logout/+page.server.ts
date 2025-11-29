import type { AmplifyAuthResponseI } from "$lib/interfaces";
import { signOut } from "@aws-amplify/auth";
import { type ActionFailure, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async ({
		cookies,
		locals
	}): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		await signOut();
		cookies.delete("session", {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: true
		});

		locals.user = null;
		locals.auth = null;
		locals.isAuthenticated = false;

		redirect(303, "/");
	}
} satisfies Actions;
