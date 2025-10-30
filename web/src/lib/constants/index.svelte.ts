import type { ConfigI } from "@dev-ekkx/svelte-star-rating";
import { MediaQuery } from "svelte/reactivity";

export const ROUTE_NAVS = [
	{
		label: "Home",
		route: "/"
	},
	{
		label: "Shop",
		route: "/shop"
	},
	{
		label: "About",
		route: "/about"
	},
	{
		label: "FAQs",
		route: "/faqs"
	},
	{
		label: "News",
		route: "/news"
	}
] as const;

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

const mediaQuery = new MediaQuery("max-width: 63.9rem");
const isMobile = $derived(mediaQuery.current);
export const config = $state<ConfigI>({
	readonly: true,
	maxVal: 5,
	minVal: 0,
	step: 0.1,
	numOfStars: 5,
	starConfig: {
		size: isMobile ? 11 : 14,
		filledColor: "#F98416",
		unfilledColor: "#5D5D5D"
	},
	styles: {
		containerStyles: "width: max-content; pointer-events: none;",
		starStyles: "gap: 0.1rem"
	}
});