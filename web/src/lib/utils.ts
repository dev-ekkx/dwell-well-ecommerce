import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SvelteURLSearchParams } from "svelte/reactivity";
import { page } from "$app/state";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import type { RouteId } from "$app/types";
import { marked } from "marked";
import { signOut } from "@aws-amplify/auth";

// SHADCN SVELTE TYPES (DON'T DELETE)
export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Formats a number by adding commas as thousands separators.
 * @param num The number to format.
 * @returns A string representation of the number with commas.
 */
export function formatNumberWithCommas(num: number): string {
	return num.toLocaleString("en-Gh");
}

export const setRouteParams = async (
	paramsToSet: Record<string, string | number>,
	noScroll = false,
	path?: string
) => {
	const currentUrl = page.url.searchParams;
	// Create a new URLSearchParams object based on the current URL's params
	const newParams = new SvelteURLSearchParams(currentUrl);

	// Iterate over the new parameters and set them
	for (const [key, value] of Object.entries(paramsToSet)) {
		if (value === null || value === undefined || value === "" || value === "[]") {
			newParams.delete(key);
		} else {
			newParams.set(key, String(value));
		}
	}

	// Construct the new URL path with the updated parameters
	const pathname = path ?? page.url.pathname;
	const queryString = newParams.toString();
	const newPath = (queryString ? `${pathname}?${queryString}` : page.url.pathname) as RouteId;

	// Navigate to the new URL
	// @ts-ignore
	await goto(resolve(newPath), {
		replaceState: true,
		keepFocus: true,
		noScroll
	});
};

marked.setOptions({
	gfm: true,
	breaks: true,
	pedantic: false
});

export async function renderMarkdown(text: string) {
	if (!text) return "No content";
	const markdown = text.replace(/\\n/g, "\n");
	const dirty = await marked.parse(markdown);

	// Only sanitize in the browser (client side)
	if (globalThis.window !== undefined) {
		const DOMPurify = (await import("dompurify")).default;
		return DOMPurify.sanitize(dirty);
	}

	// Return the raw HTML on the server
	return typeof dirty;
}

export const createInitial = (userName: string): string => {
	if (!userName?.trim()) return "N/A";

	const parts = userName.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const second = parts.at(-1)?.[0] ?? "";

	const initials = `${first}${second}`.toUpperCase();
	return initials || "N/A";
};

export const logout = async () => {
	const tasks: Promise<void>[] = [];
	tasks.push(cookieStore.delete("oldPassword"), signOut());

	return Promise.all(tasks);
};
