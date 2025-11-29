import type { UserAuthI } from "$lib/interfaces";
import { paraglideMiddleware } from "$lib/paraglide/server";
import { checkTokenExpiry } from "$lib/utils";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { signOut } from "aws-amplify/auth";

const handleTokenExpiry: Handle = async ({ event, resolve }) => {
	const { cookies } = event;
	const { auth } = JSON.parse(event.cookies.get("session") ?? "{}") as UserAuthI;

	const tokenExpiry = auth.tokenExpiry;
	const isTokenExpired = checkTokenExpiry(tokenExpiry);

	if (isTokenExpired) {
		await signOut();
		cookies.delete("session", {
			path: "/"
		});
		return redirect(303, "/?isTokenExpired=true");
	}

	return resolve(event);
};

const handleAuthCheck: Handle = async ({ event, resolve }) => {
	event.locals.user = null;
	event.locals.auth = null;
	const { auth, user } = JSON.parse(event.cookies.get("session") ?? "{}") as UserAuthI;
	const route = event.route.id;
	const isAuthenticated = !!auth.idToken;

	event.locals.isAuthenticated = isAuthenticated;
	if (isAuthenticated) {
		event.locals.user = user;
		event.locals.auth = auth;
	}

	if (route?.includes("(auth)") && isAuthenticated) {
		return redirect(303, "/");
	}

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
