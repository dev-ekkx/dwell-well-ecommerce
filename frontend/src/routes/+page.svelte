<script lang="ts">
	import Hero from './_home/hero.svelte';
	import WhyChooseUs from './_home/why-choose-us.svelte';
	import ProductCategories from './_home/product-categories.svelte';
	import FlashSales from './_home/flash-sales.svelte';
	import NewArrivals from './_home/new-arrivals.svelte';
	import type { PageProps } from './$types';
	import type { HomepageI } from '$lib/interfaces';

	const { data }: PageProps = $props();
	const homePageData = data.homepage as HomepageI;
	console.log(homePageData);
	const heroData = homePageData.contentSections.find(item => item.__component === 'page-controls.hero');
	console.log(heroData);
	const seoData = homePageData.seo;

</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} />
</svelte:head>

<div class="g-px">
	<Hero heroData={heroData} />
	<WhyChooseUs />
	<ProductCategories />
	<FlashSales />
	<NewArrivals />
</div>
