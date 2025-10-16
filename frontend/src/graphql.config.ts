import { cacheExchange, Client, fetchExchange } from "@urql/svelte";

export const client = new Client({
	url: import.meta.env.VITE_CMS_URL + "/graphql",
	exchanges: [cacheExchange, fetchExchange],
	fetchOptions: () => ({
		headers: {
			"Content-Type": "application/json"
		}
	}),
	requestPolicy: "cache-first",
});
