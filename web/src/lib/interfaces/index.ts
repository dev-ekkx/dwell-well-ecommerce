import type { ContentSectionT } from "$lib/types";
import type {
	ConfirmSignInOutput,
	ConfirmSignUpOutput,
	SignInOutput,
	SignUpOutput
} from "@aws-amplify/auth";
import type { HTMLButtonAttributes } from "svelte/elements";

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
	details: string;
	specifications: string;
	averageRating: number;
	reviewCount: number;
	inventory: number;
	price: number;
	oldPrice?: number;
	images: StrapiImageI[];
	categories: FilterI[];
	colors: FilterI[];
	sizes: FilterI[];
	availability: FilterI;
	styles: FilterI[];
	regionalAvailability: RegionalAvailabilityI[];
	productStatus?: string;
}

export interface ProductSummaryI
	extends Omit<ProductI, "categories" | "sizes" | "styles" | "availability"> {
	categories: string[];
	sizes: string[];
	styles: string[];
	availability: string;
	id: number;
	SKU: string;
	name: string;
	slug: string;
	description: string;
	details: string;
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
	hex_code?: string;
}

// Interface for all filter [categories]
export interface FiltersI {
	categories: FilterI[];
	styles: FilterI[];
	sizes: FilterI[];
	availabilities: FilterI[];
}

// Interface for User data
export interface UserI {
	userId: string;
	name: string;
	email: string;
	phone: string;
	image?: string;
	role: "admin" | "subAdmin" | "customer";
}

// Interface for Authentication data
export interface AuthI {
	accessToken: string;
	idToken: string;
	tokenExpiry: number;
}

export interface UserAuthI {
	user: UserI;
	auth: AuthI;
	countryDetails?: UserCountryI;
}

// Interface for User Store
export interface UserStoreI {
	user: UserI;
	auth: AuthI;
	updateUser: (data: UserI) => void;
	updateUserAuth: (data: AuthI) => void;
}

// Interface for Cart Item
export interface CartItemI extends Pick<ProductI, "name" | "price" | "SKU" | "inventory" | "productStatus"> {
	quantity: number;
	image: StrapiImageI;
	slug: string;
}

// Interface for Cart Store
export interface CartStoreI {
	cartItems: () => CartItemI[];
	totalItems: () => number;
	totalPrice: () => number;
	addToCart: (product: ProductI) => void;
	removeFromCart: (sku: string) => void;
	increaseQuantity: (sku: string) => void;
	reduceQuantity: (sku: string) => void;
	clearCart: () => void;
}

// Interface for response from amplify auth
export interface AmplifyAuthResponseI {
	error?: string;
	oldPassword?: string;
	isLogout?: boolean;
	authResponse?: SignInOutput | ConfirmSignInOutput | SignUpOutput | ConfirmSignUpOutput;
	userAuth?: UserAuthI;
}

// interface for the user store
export interface UserStoreI {}

// interface for UserCountry
export interface UserCountryI {
	name: string;
	country_3: string;
	country: string;
	ip: string;
}

// Interface for Country dropdown
export interface CountryAndFlagI {
	name: string;
	code: string;
	flags: {
		alt: string;
		svg: string;
		png: string;
	};
	callingCode: string;
}

// SvelteKit fetch function interface
export interface FetchI {
	(input: URL | RequestInfo, init?: RequestInit): Promise<Response>;
	(input: string | URL | Request, init?: RequestInit): Promise<Response>;
}

export interface ProductStatsI {
	lowStockAlert: number;
	pendingPricing: number;
	totalProducts: number;
	totalStock: number;
}
