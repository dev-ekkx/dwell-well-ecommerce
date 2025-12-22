import type { UserAuthI } from "$lib/interfaces";
import { paraglideMiddleware } from "$lib/paraglide/server";
import { checkTokenExpiry } from "$lib/utils";
import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";
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

	if (auth?.accessToken && isTokenExpired) {
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
	const route = String(event.route.id).split("/").pop();
	const isAuthenticated = !!auth?.idToken;

	event.locals.isAuthenticated = isAuthenticated;
	if (isAuthenticated) {
		event.locals.user = user;
		event.locals.auth = auth;
	}

	const authRoutes = ["login", "register", "reset-password", "verify_otp"];

	if (route && authRoutes.includes(route) && isAuthenticated) {
		redirect(303, "/");
	}

	return resolve(event);
};

const handleAuthGuards: Handle = async ({ event, resolve }) => {
	const route = event.route.id;
	const locals = event.locals;
	const isAuthenticated = locals.isAuthenticated;
	const user = locals.user;
	const hasAccess = user?.role !== "customer";
	const redirectTo = event.url.pathname + event.url.search;

	// Sales support guard
	if (route?.includes("(sales_support)")) {
		if (!isAuthenticated) {
			redirect(303, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
		}
		if (!hasAccess) {
			redirect(303, "/");
		}
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


// Incoming Response Hooks
export const handle: Handle = sequence(
	handleTokenExpiry,
	handleAuthCheck,
	handleAuthGuards,
	handleParaglide
);

// Outgoing Request Hooks
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
const rawSession = event.cookies.get("session") ?? "{}";
const session = JSON.parse(rawSession) as UserAuthI;
const token = session?.auth?.idToken;
console.log("Request URL: ", request.url);
    // Security Check: ONLY append the token to own API domain
    if (request.url.startsWith('https://c4jbmp5o64.execute-api.us-east-1.amazonaws.com/Prod') || request.url.startsWith('http://localhost:3000')) {
        request.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(request);
};
