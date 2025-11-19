import type { LayoutLoad } from "./$types";
import { loginSchema, resetPasswordSchema, signupSchema } from "$lib/schema";
import type { AuthType, FormInputT } from "$lib/types";
import type { ZodObject } from "zod";
import { FORM_FIELDS } from "$lib/constants";

export const load: LayoutLoad = async ({ url }) => {
	const route = url.pathname.split("/").pop() as AuthType;

	const formInputs: FormInputT = {
		login: FORM_FIELDS.login,
		signup: FORM_FIELDS.signup,
		reset_password: FORM_FIELDS.reset_password,
		otp: FORM_FIELDS.login
	};
	const schema: Record<AuthType, ZodObject> = {
		login: loginSchema,
		signup: signupSchema,
		reset_password: resetPasswordSchema,
		otp: loginSchema
	};

	return {
		route,
		formInputs: formInputs[route],
		schema: schema[route]
	};
};
