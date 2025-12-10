<script lang="ts">
	import type { PageI } from "$lib/interfaces";
	import type { PageProps } from "./$types";
	import HeroSkeleton from "./_home/hero-skeleton.svelte";

	const { data }: PageProps = $props();
	const homePageData = (data?.homepage ?? {}) as PageI;
	const seoData = homePageData?.seo ?? {};
	// const heroData = homePageData?.contentSections.find(
	// 	(item) => item.__component === "page-controls.hero"
	// ) as HeroI;

	// const whyChooseUsData = homePageData?.contentSections.find(
	// 	(item) => item.__component === "page-controls.why-choose-us"
	// );
	// const productCategoriesData = homePageData?.contentSections.find(
	// 	(item) => item.sectionId === "categories"
	// );
	// const flashSalesData = homePageData?.contentSections.find(
	// 	(item) => item.__component === "page-controls.promotion"
	// );

	// const newArrivalsData = homePageData?.contentSections.find(
	// 	(item) => item.sectionId === "newArrivals"
	// )!;

	// Provide hero images to the HeroCarousel component via context
	// if (heroData?.images.length) {

	// 	setContext("hero-images", heroData.images);
	// }
</script>

<svelte:head>
	<title>{seoData?.metaTitle || ""}</title>
	<meta content={seoData?.metaDescription || ""} />
</svelte:head>

<div class="g-px">
	<HeroSkeleton />
</div>
<!-- <div class="g-px">
	<Hero {heroData} />
	<WhyChooseUs {whyChooseUsData} />
	<ProductCategories {productCategoriesData} />
	<FlashSales {flashSalesData} />
	<NewArrivals {newArrivalsData} />
</div> -->
