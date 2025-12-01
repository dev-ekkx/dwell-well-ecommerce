import type { LayoutLoad } from "../$types";

export const load: LayoutLoad = async ({parent}) => {
const data = await parent()
console.log("Parent data", data)
    return {
		
	}
}