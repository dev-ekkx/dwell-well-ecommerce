import * as z from "zod";
import { QuestionFormSchema } from "$lib/schema";

export type QuestionType = z.infer<typeof QuestionFormSchema>;
