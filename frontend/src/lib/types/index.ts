import * as z from "zod";
import { QuestionFormSchema } from "$lib/schema";
import type {
	CategorySectionComponentI,
	HeroComponentI,
	WhyChooseUsComponentI
} from "$lib/interfaces";

export type QuestionT = z.infer<typeof QuestionFormSchema>;
export type ContactFormFieldT = keyof QuestionT;

export type InputT = "text" | "email" | "textarea";

// A Union Type representing any possible component in the Dynamic Zone for a page
export type ContentSectionT = HeroComponentI | CategorySectionComponentI | WhyChooseUsComponentI;
