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

export type ProductDataMap = Record<
	string,
	{
		price: number;
		oldPrice?: number;
		averageRating: number;
		reviewCount: number;
		inventory: number;
	}
>;

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
	prev: () => void;
	next: () => void;
	collectItems: () => void;
};
