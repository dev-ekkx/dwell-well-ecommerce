import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import type { PageI, ShowroomI } from "$lib/interfaces";
import { client } from "../../graphql.config";
import { GET_SHOWROOMS_QUERY } from "../../graphql.queries";

export const load: PageLoad = async ({ fetch }) => {
	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;

	// Create promises for both fetch requests so they can run in parallel
	const aboutPagePromise = fetch(`${cmsBaseUrl}/api/pages?filters[slug][$eq]=about&populate=all`);
	const showroomsPromise = await client.query(GET_SHOWROOMS_QUERY, {}).toPromise();

	// Wait for both promises to resolve at the same time
	const [aboutPageResponse, showroomsResponse] = await Promise.all([
		aboutPagePromise,
		showroomsPromise
	]);

	// Check if either response failed
	if (!aboutPageResponse.ok || showroomsResponse.error) {
		throw error(500, "Failed to fetch page data from the CMS");
	}

	// Parse the JSON from both responses
	const aboutPageJson = await aboutPageResponse.json();

	// Extract the page data, checking if it exists
	const aboutData: PageI = aboutPageJson.data[0];
	if (!aboutData) {
		throw error(404, "About page not found in the CMS");
	}
	const showrooms = showroomsResponse.data.showrooms as ShowroomI[];

	// Return both sets of data for the page to use
	return {
		about: aboutData,
		showrooms: showrooms
	};
};
