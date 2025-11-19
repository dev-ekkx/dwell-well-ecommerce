import type { AmplifyAuthResponseI } from "$lib/interfaces";
import { type ActionFailure, fail } from "@sveltejs/kit";
import { signOut } from "@aws-amplify/auth";
import type { Actions } from "./$types";

export const actions = {
	default: async (): Promise<AmplifyAuthResponseI | ActionFailure<{ error: string }>> => {
		try {
			await signOut();
			return {};
		} catch (e) {
			return fail(400, { error: (e as Error).message });
		}
	}
} satisfies Actions;
