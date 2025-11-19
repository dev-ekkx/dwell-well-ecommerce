export const ROUTE_NAVS = [
	{
		label: "Home",
		route: "/"
	},
	{
		label: "Shop",
		route: "/shop"
	},
	{
		label: "About",
		route: "/about"
	},
	{
		label: "FAQs",
		route: "/faqs"
	},
	{
		label: "News",
		route: "/news"
	}
] as const;

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const FORM_FIELDS = {
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
	],
	reset_password: [
		{
			name: "oldPassword",
			label: "Old Password",
			type: "password",
			placeholder: "Enter password"
		},
		{
			name: "newPassword",
			label: "New Password",
			type: "password",
			placeholder: "Enter password"
		},
		{
			name: "confirmPassword",
			label: "Confirm Password",
			type: "password",
			placeholder: "Confirm password"
		}
	],
	otp: [
		{ name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
		{ name: "password", label: "Password", type: "password", placeholder: "Enter your password" }
	]
};

export const AUTH_ROUTES = ["login", "signup", "otp", "reset_password"] as const;
