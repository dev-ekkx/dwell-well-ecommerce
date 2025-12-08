import type { PageLoad } from "./$types";

export const load: PageLoad = ({ data }) => {
	const { totalProducts, products } = data;
	return {
		totalProducts,
		products
	};
};
