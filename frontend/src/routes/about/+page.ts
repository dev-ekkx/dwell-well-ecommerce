import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import type { PageI } from "$lib/interfaces";

export const load: PageLoad = async ({ fetch }) => {
	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;

	try {
		// Create promises for both fetch requests so they can run in parallel
		const aboutPagePromise = fetch(`${cmsBaseUrl}/api/pages?filters[slug][$eq]=about&populate=all`);
		const showroomsPromise = fetch(`${cmsBaseUrl}/api/showrooms?populate=*`);

		// Wait for both promises to resolve at the same time
		const [aboutPageResponse, showroomsResponse] = await Promise.all([
			aboutPagePromise,
			showroomsPromise
		]);

		// Check if either response failed
		if (!aboutPageResponse.ok || !showroomsResponse.ok) {
			throw error(500, "Failed to fetch page data from the CMS");
		}

		// Parse the JSON from both responses
		const aboutPageJson = await aboutPageResponse.json();
		const showroomsJson = await showroomsResponse.json();

		// Extract the page data, checking if it exists
		const aboutData: PageI = aboutPageJson.data[0];
		if (!aboutData) {
			throw error(404, "About page not found in the CMS");
		}
		console.log(showroomsJson);
		// Extract the showroom data, which is an array
		// const showroomList: ShowroomI[] = showroomsJson.data.map((item: any) => item.attributes);

		// Return both sets of data for the page to use
		return {
			about: aboutData,
			showrooms: null
		};
	} catch (err) {
		// Log the actual error for debugging on the server
		console.error("Error fetching data from CMS: ", err);

		// Throw a user-friendly error to be displayed on an error page
		throw error(500, "An internal error occurred");
	}
};
