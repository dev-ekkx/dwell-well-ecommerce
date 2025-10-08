<script lang="ts">
	import AboutHero from './about-hero.svelte';
	import GlobalReach from './global-reach.svelte';
	import WhatWeAreKnownFor from './what-we-are-known-for.svelte';
	import GlobalPresence from './global-presence.svelte';
	import LeadershipTeam from './leadership-team.svelte';
	import Showrooms from './showrooms.svelte';
	import ContactUs from './contact-us.svelte';
	import type { PageProps } from './$types';
	import type { PageI } from '$lib/interfaces';

	const { data }: PageProps = $props();
	const aboutPageData = data.about as PageI;
	console.log(aboutPageData);
	const seoData = aboutPageData.seo;
	const heroData = aboutPageData.contentSections.find(item => item.__component === 'page-controls.hero');
	const globalReachData = aboutPageData.contentSections.find(
		item => item.__component === 'page-controls.who-we-are'
	);
</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} />
</svelte:head>

<AboutHero heroData={heroData} />
<GlobalReach globalReachData={globalReachData} />
<WhatWeAreKnownFor />
<GlobalPresence />
<LeadershipTeam />
<Showrooms />
<ContactUs />