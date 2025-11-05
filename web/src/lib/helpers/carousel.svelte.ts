// carousel.svelte.ts
import gsap from "gsap";
import { onMount } from "svelte";

export type CarouselOptions<T> = {
	items: T[];
	repeat?: number;
	initialIndex?: number;
};

export type CarouselState<T> = {
	displayedItems: (T & { _r: number })[];
	index: number;
	carouselState: {
		container: HTMLElement | null;
		track: HTMLElement | null;
	};
	itemsElements: HTMLElement[];
	prev: () => void;
	next: () => void;
	scrollToIndex: (i: number) => void;
	collectItems: () => void;
};

export function useCarousel<T>(options: CarouselOptions<T>): CarouselState<T> {
	let carouselState = $state<{
		container: HTMLElement | null;
		track: HTMLElement | null;
	}>({
		container: null,
		track: null
	});
	const REPEAT = options.repeat ?? 5;
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
		itemsElements = Array.from(carouselState.track.querySelectorAll(":scope > div"));
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

			// Setup listeners and cleanup, similar to onMount
			const ro = new ResizeObserver(onResize);
			if (carouselState.container) ro.observe(carouselState.container);
			ro.observe(carouselState.track); // track is guaranteed to be non-null here
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
		itemsElements,
		prev,
		next,
		scrollToIndex,
		collectItems
	};
}
