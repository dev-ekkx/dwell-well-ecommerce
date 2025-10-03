import type { Actions } from "./$types";

export const actions = {
	default: async (event) => {
		console.log("form event: ", event);
	}
} satisfies Actions;
