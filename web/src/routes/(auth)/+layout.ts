import { FORM_FIELDS } from "$lib/constants";
import { loginSchema, otpSchema, resetPasswordSchema, signupSchema } from "$lib/schema";
import type { AuthType, FormInputT } from "$lib/types";
import type { ZodObject } from "zod";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url, data }) => {
	const route = url.pathname.split("/").pop() as AuthType;
	const formInputs: FormInputT = {
		login: FORM_FIELDS.login,
		signup: FORM_FIELDS.signup,
		reset_password: FORM_FIELDS.reset_password,
		verify_otp: FORM_FIELDS.verify_otp
	};
	const schema: Record<AuthType, ZodObject> = {
		login: loginSchema,
		signup: signupSchema,
		reset_password: resetPasswordSchema,
		verify_otp: otpSchema
	};
	return {
		route,
		formInputs: formInputs[route],
		schema: schema[route]
	};
};
