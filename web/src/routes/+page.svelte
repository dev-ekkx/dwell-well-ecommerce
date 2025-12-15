<script lang="ts">
	import NewArrivals from "./_home/new-arrivals.svelte";

	import type { HeroI, PageI } from "$lib/interfaces";
	import { onMount, setContext } from "svelte";
	import type { PageProps } from "./$types";
	import FlashSalesSkeleton from "./_home/flash-sales-skeleton.svelte";
	import FlashSales from "./_home/flash-sales.svelte";
	import HeroSkeleton from "./_home/hero-skeleton.svelte";
	import Hero from "./_home/hero.svelte";
	import NewArrivalsSkeleton from "./_home/new-arrivals-skeleton.svelte";
	import ProductCategoriesSkeleton from "./_home/product-categories-skeleton.svelte";
	import ProductCategories from "./_home/product-categories.svelte";
	import WhyChooseUsSkeleton from "./_home/why-choose-us-skeleton.svelte";
	import WhyChooseUs from "./_home/why-choose-us.svelte";

	const { data }: PageProps = $props();
	let homePageData = $state({}) as PageI;
	const seoData = $derived(homePageData?.seo ?? {})
	
	onMount(async () => {
		const res = await data?.homepage
		homePageData = (await res?.json()).data[0] as PageI;
	})

	const heroData = $derived(homePageData?.contentSections?.find(
		(item) => item.__component === "page-controls.hero"
	) as HeroI);
	const whyChooseUsData = $derived(homePageData?.contentSections?.find(
		(item) => item.__component === "page-controls.why-choose-us"
	));
	const productCategoriesData = $derived(homePageData?.contentSections?.find(
		(item) => item.__component === "page-controls.category-or-new-arrival-section"
	));
	const flashSalesData = $derived(homePageData?.contentSections?.find(
		(item) => item.__component === "page-controls.promotion"
	));
	const newArrivalsData = $derived(homePageData?.contentSections?.find(
		(item) => item.sectionId === "newArrivals"
	));



	// Provide hero images to the HeroCarousel component via context
$effect(() => {
	setContext("hero-images", heroData?.images ?? []);
})

</script>

<svelte:head>
	<title>{seoData?.metaTitle || ""}</title>
	<meta content={seoData?.metaDescription || ""} />
</svelte:head>


<div class="g-px">
{#await data?.homepage}
	{@render loaders()}
{:then}
	{@render pageContent()}
{/await}
</div>

{#snippet loaders()}
<HeroSkeleton />
<WhyChooseUsSkeleton />
<ProductCategoriesSkeleton />
<FlashSalesSkeleton />
<NewArrivalsSkeleton />
{/snippet}

{#snippet pageContent()}
	<Hero {heroData} />
	<WhyChooseUs {whyChooseUsData} />
	<ProductCategories {productCategoriesData} />
	<FlashSales {flashSalesData} />
	<NewArrivals {newArrivalsData} />
{/snippet}