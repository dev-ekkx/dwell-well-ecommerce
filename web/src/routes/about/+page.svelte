<script lang="ts">
	import AboutHero from "./about-hero.svelte";
	import GlobalReach from "./global-reach.svelte";
	import WhatWeAreKnownFor from "./what-we-are-known-for.svelte";
	import GlobalPresence from "./global-presence.svelte";
	import Showrooms from "./showrooms.svelte";
	import ContactUs from "$lib/components/contact-us.svelte";
	import LeadershipTeam from "./leadership-team.svelte";
	import type { PageProps } from "./$types";
	import type {
		GlobalPresenceI,
		GlobalReachI,
		HeroI,
		LeadershipTeamI,
		PageI,
		WhyChooseUsI
	} from "$lib/interfaces";
	import { setContext } from "svelte";

	const { data }: PageProps = $props();
	const aboutPageData = data.about as PageI;
	const seoData = aboutPageData.seo;
	const heroData = aboutPageData.contentSections.find(
		(item) => item.__component === "page-controls.hero"
	) as HeroI;
	const globalReachData = aboutPageData.contentSections.find(
		(item) => item.__component === "page-controls.who-we-are"
	) as GlobalReachI;
	const whatWeAreKnownForData = aboutPageData.contentSections.find(
		(item) => item.__component === "page-controls.why-choose-us"
	) as WhyChooseUsI;
	const globalPresenceData = aboutPageData.contentSections.find(
		(item) => item.__component === "page-controls.global-presence"
	) as GlobalPresenceI;
	const leadershipTeamData = aboutPageData.contentSections.find(
		(item) => item.__component === "management.leadership-team"
	) as LeadershipTeamI;
	const showRoomsSection = aboutPageData.contentSections.find(
		(item) => item.__component === "page-controls.showrooms-section"
	) as {
		title: string;
		description: string;
	};
	const showroomData = {
		showrooms: data.showrooms,
		...showRoomsSection
	};

	//Create map context for global presence map
	setContext("map-coordinates", globalPresenceData.locationLatLng);
</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} />
</svelte:head>

<AboutHero {heroData} />
<GlobalReach {globalReachData} />
<WhatWeAreKnownFor {whatWeAreKnownForData} />
<GlobalPresence {globalPresenceData} />
<LeadershipTeam {leadershipTeamData} />
<Showrooms {showroomData} />
<ContactUs />
