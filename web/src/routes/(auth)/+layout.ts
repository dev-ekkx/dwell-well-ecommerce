import type { LayoutLoad } from "./$types";
import { loginSchema, signupSchema } from "$lib/schema";

export const load: LayoutLoad = async ({ url }) => {
	const route = url.pathname.split("/").pop() as "login" | "signup";

	const formInputs = {
		login: [
			{ name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
			{ name: "password", label: "Password", type: "password", placeholder: "Enter your password" }
		],
		signup: [
			{ name: "name", label: "Full Name", type: "text", placeholder: "Enter your name" },
			{ name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
			{ name: "password", label: "Password", type: "password", placeholder: "Enter password" },
			{
				name: "confirmPassword",
				label: "Confirm Password",
				type: "password",
				placeholder: "Confirm password"
			}
		]
	};

	return {
		route,
		formInputs: formInputs[route],
		schema: route === "login" ? loginSchema : signupSchema
	};
};
