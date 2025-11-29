// import { paraglideMiddleware } from "$lib/paraglide/server";
// import { checkTokenExpiry } from "$lib/utils";
// import type { Handle } from "@sveltejs/kit";

import { paraglideMiddleware } from "$lib/paraglide/server";
import { checkTokenExpiry } from "$lib/utils";
import { redirect, type Handle } from "@sveltejs/kit";
import { signOut } from "aws-amplify/auth";

// const handleParaglide: Handle = ({ event, resolve }) =>
// 	paraglideMiddleware(event.request, ({ request, locale }) => {
// 		event.request = request;

// 		return resolve(event, {
// 			transformPageChunk: ({ html }) => html.replace("%paraglide.lang%", locale)
// 		});
// 	});

// export const handle: Handle = handleParaglide;

// // Auto logout if token expires
// const isTokenExpired = checkTokenExpiry(getUserAndAuthData().auth.tokenExpiry);

export const handle: Handle = async ({ event, resolve }) => {
	const { url, cookies } = event;
	const authRes = JSON.parse(cookies.get("authRes") ?? "{}");
	const tokenExpiry = authRes?.auth?.tokenExpiry;
	const isTokenExpired = checkTokenExpiry(tokenExpiry);
	console.log(isTokenExpired);

	if (isTokenExpired) {
		await signOut();
		cookies.delete("authRes", {
			path: "/"
		});
		return redirect(303, "/?isTokenExpired=true");
	}

	return paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace("%paraglide.lang%", locale)
		});
	});
};
