import * as z from "zod";
import { QuestionFormSchema } from "$lib/schema";
import type {
	CategoryI,
	GlobalPresenceI,
	GlobalReachI,
	HeroI,
	LeadershipTeamI,
	NewArrivalI,
	WhyChooseUsI
} from "$lib/interfaces";
import { AUTH_ROUTES } from "$lib/constants";

export type QuestionT = z.infer<typeof QuestionFormSchema>;
export type ContactFormFieldT = keyof QuestionT;
export type InputT = "text" | "email" | "textarea";

// A Union Type representing any possible component in the Dynamic Zone for a page
export type ContentSectionT =
	| HeroI
	| CategoryI
	| WhyChooseUsI
	| NewArrivalI
	| GlobalReachI
	| GlobalPresenceI
	| LeadershipTeamI;

export type ProductDataMapT = Record<
	string,
	{
		price: number;
		oldPrice?: number;
		averageRating: number;
		reviewCount: number;
		inventory: number;
	}
>;

export type CarouselOptionsT<T> = {
	items: T[];
	repeat?: number;
	initialIndex?: number;
};

export type CarouselStateT<T> = {
	displayedItems: (T & { _r: number })[];
	index: number;
	carouselState: {
		container: HTMLElement | null;
		track: HTMLElement | null;
	};
	prev: () => void;
	next: () => void;
	collectItems: () => void;
};

export type AuthType = (typeof AUTH_ROUTES)[number];

export type FormInputT = Record<
	AuthType,
	Array<{
		name: string;
		label: string;
		type: string;
		placeholder: string;
	}>
>;
