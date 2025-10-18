import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RouteId } from "$app/types";
import { SvelteURLSearchParams } from "svelte/reactivity";
import { page } from "$app/state";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";

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
	noScroll = false
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
	const queryString = newParams.toString();
	const newPath = (
		queryString ? `${page.url.pathname}?${queryString}` : page.url.pathname
	) as RouteId;

	// Navigate to the new URL
	await goto(resolve(newPath), {
		replaceState: true,
		keepFocus: true,
		noScroll
	});
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
