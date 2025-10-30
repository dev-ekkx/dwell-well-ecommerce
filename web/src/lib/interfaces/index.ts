import type { HTMLButtonAttributes } from "svelte/elements";
import type { ContentSectionT } from "$lib/types";

export interface ButtonI extends HTMLButtonAttributes {
	direction: "left" | "right";
}

export interface FilterDropdownI {
	title: string;
	options?: FilterI[];
	selectedOptions?: string[];
	selectedSlides?: number[];
	maxSlideValue?: number;
	type?: "checkbox" | "slider";
	onValueChange?: () => void;
}

// Category interface
export interface CategoryI {
	id: number;
	name: string;
	slug: string;
}

// Country-specific details
export interface CountrySpecificsI {
	id: number;
	isAvailable: boolean;
	country: CountryI;
	// Assuming SalesRepI would be defined elsewhere
	salesReps: unknown[];
}

// Regional availability
export interface RegionalAvailabilityI {
	id: number;
	region: RegionI;
	countrySettings: CountrySpecificsI[];
}

//Product interface
export interface ProductI {
	id: number;
	SKU: string;
	name: string;
	slug: string;
	description: string;
	images: StrapiImageI[];
	categories: FilterI[];
	regionalAvailability: RegionalAvailabilityI[];
	sizes: FilterI[];
	availability: FilterI;
	styles: FilterI[];
	oldPrice?: number;
	price: number;
	averageRating: number;
	reviewCount: number;
	inventory: number;
}

// Interface for a region (continent)
export interface RegionI {
	name: string;
}

// Interface for a country
export interface CountryI {
	name: string;
	region: RegionI;
}

// Interface for a showroom
export interface ShowroomI {
	name: string;
	image: StrapiImageI;
	country: CountryI;
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

// // Product interface
// export interface ProductI {
// 	id: number;
// 	name: string;
// 	slug: string;
// 	price: number;
// 	description: string;
// 	images: StrapiImageI[];
// }

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
export interface HeroI {
	__component: string;
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
export interface CategoryI {
	__component: string;
	id: number;
	sectionId?: string;
	title: string;
	items: CategoryItemI[];
}

export interface NewArrivalI extends CategoryI {
	sectionId: string;
}

// Represents a reason in the "Why Choose Us" section (structure inferred)
export interface ReasonI {
	id: number;
	title: string;
	description: string;
	icon: StrapiImageI;
}

// Represents the "Why Choose Us" section component
export interface WhyChooseUsI {
	__component: string;
	id: number;
	sectionId?: string;
	title: string;
	description: string;
	reasons: ReasonI[];
	image: StrapiImageI;
}

// Represents the Flash Sale section component (structure inferred)
export interface FlashSaleI {
	__component: string;
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
	__component: string;
	id: number;
	title: string;
	sectionId?: string;
	description: string;
	reaches: GlobalReachItemI[];
}

// Interface for the Global Presence data structure
export interface GlobalPresenceI {
	__component: string;
	id: number;
	title: string;
	sectionId?: string;
	description: string;
	locationLatLng: {
		lat: number;
		lng: number;
	};
}

// Interface for a team member in the Team Section
export interface TeamMemberI {
	id: number;
	name: string;
	role: string;
	profilePicture: StrapiImageI;
}

export interface LeadershipTeamI {
	__component: string;
	id: number;
	title: string;
	sectionId?: string;
	description: string;
	team: TeamMemberI[];
}

// The main interface for the entire page data structure
export interface PageI {
	slug: string;
	title: string;
	seo: SeoI;
	contentSections: ContentSectionT[];
}

// Interface for filter options
export interface FilterI {
	name: string;
	slug: string;
}

// Interface for all filter categories
export interface FiltersI {
	categories: FilterI[];
	styles: FilterI[];
	sizes: FilterI[];
	availabilities: FilterI[];
}
