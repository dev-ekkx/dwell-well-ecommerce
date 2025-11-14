export const actions = {
	default: async ({ cookies, request }) => {
		// console.log("cookies: ", cookies);
		const data = await request.formData();
		const formData = Object.fromEntries(data.entries());
		console.log("form data: ", formData);

		return {};
	}
};
