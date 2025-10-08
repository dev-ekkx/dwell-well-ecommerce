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
	const seoData = aboutPageData.seo;
	const heroData = aboutPageData.contentSections.find(item => item.__component === 'page-controls.hero');
	const globalReachData = aboutPageData.contentSections.find(
		item => item.__component === 'page-controls.who-we-are'
	);
	const whatWeAreKnownForData = aboutPageData.contentSections.find(
		item => item.__component === 'page-controls.why-choose-us'
	);
</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} />
</svelte:head>

<AboutHero heroData={heroData} />
<GlobalReach globalReachData={globalReachData} />
<WhatWeAreKnownFor whatWeAreKnownForData={whatWeAreKnownForData} />
<GlobalPresence />
<LeadershipTeam />
<Showrooms />
<ContactUs />