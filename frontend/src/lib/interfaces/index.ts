import type { HTMLButtonAttributes } from "svelte/elements";

export interface WhyChooseUsI {
	icon: string;
	label: string;
	description: string;
}

export interface ButtonI extends HTMLButtonAttributes {
	direction: "left" | "right";
}

interface Link {
	label: string;
	link: string;
}

export interface FooterSection {
	title: string;
	links: Link[];
}
