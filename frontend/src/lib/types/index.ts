import * as z from "zod";
import { QuestionFormSchema } from "$lib/schema";

export type QuestionT = z.infer<typeof QuestionFormSchema>;
export type ContactFormFieldT = keyof QuestionT;

export type InputT = "text" | "email" | "textarea";
