import type { PageLoad } from "./$types";

export const load: PageLoad = ({ data }) => {
	return {
		productStatAndData: data.productStatAndData
	}
};
