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
	import { setContext } from 'svelte';

	const { data }: PageProps = $props();
	const aboutPageData = data.about as PageI;
	console.log(aboutPageData);
	const seoData = aboutPageData.seo;
	const heroData = aboutPageData.contentSections.find(item => item.__component === 'page-controls.hero');
	const globalReachData = aboutPageData.contentSections.find(
		item => item.__component === 'page-controls.who-we-are'
	);
	const whatWeAreKnownForData = aboutPageData.contentSections.find(
		item => item.__component === 'page-controls.why-choose-us'
	);
	const globalPresenceData = aboutPageData.contentSections.find(
		item => item.__component === 'page-controls.global-presence'
	);
	const leadershipTeamData = aboutPageData.contentSections.find(
		item => item.__component === 'management.leadership-team'
	);

	//Create map context for global presence map
	setContext('map-coordinates', globalPresenceData.locationLatLng);
</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} />
</svelte:head>

<AboutHero heroData={heroData} />
<GlobalReach globalReachData={globalReachData} />
<WhatWeAreKnownFor whatWeAreKnownForData={whatWeAreKnownForData} />
<GlobalPresence globalPresenceData={globalPresenceData} />
<LeadershipTeam leadershipTeamData={leadershipTeamData} />
<Showrooms />
<ContactUs />