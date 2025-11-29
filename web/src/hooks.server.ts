// import { paraglideMiddleware } from "$lib/paraglide/server";
// import { checkTokenExpiry } from "$lib/utils";
// import type { Handle } from "@sveltejs/kit";

import { paraglideMiddleware } from "$lib/paraglide/server";
import { checkTokenExpiry } from "$lib/utils";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { signOut } from "aws-amplify/auth";



const handleTokenExpiry: Handle = async ({ event, resolve }) => {
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

	return resolve(event);
};


const handleAuthCheck: Handle = async ({ event, resolve }) => {
    // In a real app, you'd verify a session cookie and set event.locals.user
    const sessionCookie = event.cookies.get('authRes'); 
    
    // Assume isAuthenticated is a boolean after checking the cookie
    const isAuthenticated = !!sessionCookie; // Replace with actual verification
    
    // Store authentication status (or user data) in locals
    // event.locals.isAuthenticated = isAuthenticated; 

	console.log(sessionCookie, isAuthenticated);

    return resolve(event);
};


const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace("%paraglide.lang%", locale)
		});
	});

export const handle: Handle = sequence(handleTokenExpiry, handleAuthCheck, handleParaglide);
