import * as z from "zod";

export const QuestionFormSchema = z.object({
	name: z.string().nonempty("Name is required"),
	email: z.pipe(z.string().nonempty("Email is required"), z.email("Invalid email")),
	message: z.string().nonempty("Message is required")
});
