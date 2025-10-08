import type { HTMLButtonAttributes } from "svelte/elements";
import type { ContentSectionT } from "$lib/types";

export interface WhyChooseUsI {
	icon: string;
	label: string;
	description: string;
}

export interface ButtonI extends HTMLButtonAttributes {
	direction: "left" | "right";
}

// --- Footer Component Interfaces ---

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

// Product interface
export interface ProductI {
	id: number;
	name: string;
	slug: string;
	price: number;
	description: string;
	images: StrapiImageI[];
}

// --- New Homepage Interfaces ---

// Interface for a standard Strapi media object
export interface StrapiImageI {
	url: string;
	alternativeText: string;
}

// Interface for a Call-to-Action button
export interface CtaButtonI {
	id: number;
	text: string;
	url: string;
}

// --- Homepage Dynamic Zone Component Interfaces ---

// Represents the Hero component
export interface HeroComponentI {
	__component: "page-controls.hero";
	id: number;
	sectionId?: string;
	title: string;
	subTitle: string;
	images: StrapiImageI[];
	ctaButtons: CtaButtonI[];
}

// Represents an item in the Category section (structure inferred)
export interface CategoryItemI {
	id: number;
	title: string;
	image: StrapiImageI;
	url: string;
}

// Represents the Category/New Arrival section component
export interface CategorySectionComponentI {
	__component: "page-controls.category-or-new-arrival-section";
	id: number;
	sectionId?: string;
	title: string;
	items: CategoryItemI[];
}

export interface NewArrivalSectionComponentI extends CategorySectionComponentI {
	sectionId: string;
}

// Represents a reason in the "Why Choose Us" section (structure inferred)
export interface ReasonI {
	id: number;
	title: string;
	description: string;
}

// Represents the "Why Choose Us" section component
export interface WhyChooseUsComponentI {
	__component: "page-controls.why-choose-us";
	id: number;
	sectionId?: string;
	title: string;
	description: string;
	reasons: ReasonI[];
}

// Represents the Flash Sale section component (structure inferred)
export interface FlashSaleComponentI {
	__component: "page-controls.flash-sale";
	id: number;
	title: string;
	description: string;
	endDate: Date;
	product: ProductI;
	cta: CtaButtonI;
}

// Interface for the SEO component data
export interface SeoI {
	id: number;
	metaTitle: string;
	metaDescription: string;
}
// Interface for the Global Reach component data
export interface GlobalReachItemI {
	id: number;
	label: string;
	value: string;
}

// Interface for the Global Reach data structure
export interface GlobalReachI {
	id: number;
	title: string;
	description: string;
	reaches: GlobalReachItemI[];
}

// Interface for the Global Presence data structure
export interface GlobalPresenceI {
	id: number;
	title: string;
	description: string;
	locationLatLng: {
		lat: number;
		lng: number;
	};
}

// The main interface for the entire page data structure
export interface PageI {
	slug: string;
	title: string;
	seo: SeoI;
	contentSections: ContentSectionT[];
}
