import type { HTMLButtonAttributes } from "svelte/elements";

export interface WhyChooseUsI {
	icon: string;
	label: string;
	description: string;
}

export interface ButtonI extends HTMLButtonAttributes {
	direction: "left" | "right";
}
// Interface for an individual link in a column
export interface LinkI {
	id: number;
	label: string;
	url: string;
}

// Interface for a column of links in the footer
export interface LinkColumnI {
	id: number;
	title: string;
	links: LinkI[];
}

// Interface for the necessary fields of an icon from Strapi's media library
export interface IconI {
	url: string;
	alternativeText: string;
}

// Interface for a social media link
export interface SocialLinkI {
	id: number;
	url: string;
	icon: IconI;
}

// The main interface for the entire Footer data structure
export interface FooterI {
	newsletterTitle: string;
	newsletterDescription: string;
	newsletterDisclaimer: string;
	contactTitle: string;
	contactEmail: string;
	contactPhoneNumber: string;
	copyrightText: string;
	linkColumns: LinkColumnI[];
	socialLinks: SocialLinkI[];
}
