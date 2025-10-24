import type {LayoutLoad} from "./$types";
import {apiPlugin, storyblokInit, useStoryblokApi} from "@storyblok/svelte";
import type {FooterI} from "$lib/interfaces";

export const load: LayoutLoad = async ({ fetch }) => {
	try {

        storyblokInit({
            accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN,
            apiOptions: {
                region: 'eu',
            },
            use: [apiPlugin],
        });

        const storyblokAPI = await useStoryblokApi();
        //
        // return {
        // };

		const footerData = await fetch(import.meta.env.VITE_CMS_URL + "/api/footer?populate=all");
		const data = (await footerData.json()).data as FooterI;

		return {
            storyblokAPI,
			footer: data
		};
	} catch (error) {
		console.error("Error loading footer data: ", error);
		return {
			footer: null
		};
	}


};
