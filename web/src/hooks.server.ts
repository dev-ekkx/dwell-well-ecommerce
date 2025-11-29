import type { UserAuthI } from "$lib/interfaces";
import { paraglideMiddleware } from "$lib/paraglide/server";
import { checkTokenExpiry } from "$lib/utils";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { signOut } from "aws-amplify/auth";

const handleTokenExpiry: Handle = async ({ event, resolve }) => {
	const { cookies } = event;
	const { auth } = JSON.parse(event.cookies.get("session") ?? "{}") as UserAuthI;
	const route = event.route.id;
	const tokenExpiry = auth?.tokenExpiry ?? 0;
	const isTokenExpired = checkTokenExpiry(tokenExpiry);

	if (route?.includes("(auth)")) {
		return resolve(event);
	}

	if (isTokenExpired) {
		await signOut();
		cookies.delete("session", {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: true
		});
		event.locals.user = null;
		event.locals.auth = null;
		if (route !== "/") {
			redirect(303, "/");
		}
	}

	return resolve(event);
};

const handleAuthCheck: Handle = async ({ event, resolve }) => {
	event.locals.user = null;
	event.locals.auth = null;
	const { auth, user } = JSON.parse(event.cookies.get("session") ?? "{}") as UserAuthI;
	const route = event.route.id;
	const isAuthenticated = !!auth?.idToken;

	event.locals.isAuthenticated = isAuthenticated;
	if (isAuthenticated) {
		event.locals.user = user;
		event.locals.auth = auth;
	}

	const authRoutes = ["/login", "/register", "/reset-password", "/verify_otp"];

	if (route && authRoutes.includes(route) && isAuthenticated) {
		redirect(303, "/");
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
