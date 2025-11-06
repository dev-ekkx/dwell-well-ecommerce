import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SvelteURLSearchParams } from "svelte/reactivity";
import { page } from "$app/state";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import type { RouteId } from "$app/types";
import { marked } from "marked";
import DOMPurify from "dompurify";
import gsap from "gsap";
import { onMount } from "svelte";
import type { CarouselOptions, CarouselState } from "$lib/types";

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

export function renderMarkdown(text: string) {
	if (!text) return "No content";
	const markdown = text.replace(/\\n/g, "\n");
	return DOMPurify.sanitize(marked(markdown).toString());
}

export function useCarousel<T>(options: CarouselOptions<T>): CarouselState<T> {
	let carouselState = $state<{
		container: HTMLElement | null;
		track: HTMLElement | null;
	}>({
		container: null,
		track: null
	});
	const REPEAT = Math.max(options.repeat ?? 5, 2);
	const itemsData = options.items;
	let index = options.initialIndex ?? itemsData.length;

	let itemsElements = $state<HTMLElement[]>([]);

	const displayedItems = Array.from({ length: REPEAT }, (_, r) =>
		itemsData.map((p) => ({ ...p, _r: r }))
	).flat();

	function computeXForIndex(i: number) {
		if (!carouselState.track || itemsElements.length === 0 || !itemsElements[i]) return 0;
		return -itemsElements[i].offsetLeft;
	}

	function normalizeIndex() {
		const n = itemsData.length;
		if (n === 0) return;
		const middleStart = n;
		const normalized = ((((index - middleStart) % n) + n) % n) + middleStart;
		if (normalized !== index) {
			index = normalized;
			const x = computeXForIndex(index);
			if (carouselState.track) gsap.set(carouselState.track, { x });
		}
	}

	function scrollToIndex(i: number) {
		if (!carouselState.track || itemsElements.length === 0) return;
		index = i;
		const x = computeXForIndex(index);
		gsap.to(carouselState.track, {
			x,
			duration: 0.5,
			ease: "power1.out",
			overwrite: "auto",
			force3D: true,
			onComplete: normalizeIndex
		});
	}

	function prev() {
		scrollToIndex(index - 1);
	}

	function next() {
		scrollToIndex(index + 1);
	}

	function collectItems() {
		if (!carouselState.track) return;
		itemsElements = Array.from(carouselState.track.children) as HTMLElement[];
	}

	function onResize() {
		if (!carouselState.track) return;
		const x = computeXForIndex(index);
		gsap.set(carouselState.track, { x });
	}

	onMount(() => {
		if (carouselState.track) {
			collectItems();
			const x = computeXForIndex(index);
			gsap.set(carouselState.track, { x, willChange: "transform", force3D: true });

			const ro = new ResizeObserver(onResize);
			if (carouselState.container) ro.observe(carouselState.container);
			ro.observe(carouselState.track);
			window.addEventListener("resize", onResize);

			return () => {
				ro.disconnect();
				window.removeEventListener("resize", onResize);
			};
		}
	});

	return {
		displayedItems,
		index,
		carouselState,
		prev,
		next,
		collectItems
	};
}

export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
