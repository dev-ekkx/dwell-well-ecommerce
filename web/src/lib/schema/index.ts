import { z } from "zod";

const strongPassword = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/\d/, "Password must contain at least one number")
	.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (e.g. @, #, $, %)");

const phoneRegex = new RegExp(/^\d[ -]?(\d{2,4})[ -]?(\d{3,4})[ -]?(\d{3,4})[ -]?(\d{0,4})$/);
export const QuestionFormSchema = z.object({
	name: z.string().nonempty("Name is required"),
	email: z.pipe(z.string().nonempty("Email is required"), z.email("Invalid email")),
	message: z.string().nonempty("Message is required")
});

export const loginSchema = z.object({
	email: z.pipe(z.string().nonempty("Email is required"), z.email("Invalid email address")),
	password: z.string().nonempty("Password is required")
});

export const signupSchema = z
	.object({
		name: z.string().nonempty("Name is required").min(3, "Name is required"),
		email: z.pipe(z.string().nonempty("Email is required"), z.email("Invalid email address")),
		phone: z
			.string()
			.nonempty("Phone Number is required")
			.min(10, { message: "Phone number must be at least 10 digits." })
			.max(20, { message: "Phone number cannot exceed 20 characters." })
			.regex(phoneRegex, { message: "Invalid phone number format." }),
		password: strongPassword,
		confirmPassword: z.string().nonempty("Confirm Password is required")
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"]
	});

export const resetPasswordSchema = z
	.object({
		oldPassword: z.string().nonempty("Password is required"),
		newPassword: strongPassword,
		confirmPassword: z.string().nonempty("Confirm Password is required")
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"]
	});

	export const otpSchema = z.object({
		otp: z.string().nonempty("OTP is required")
	});