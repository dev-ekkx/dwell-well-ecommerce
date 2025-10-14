<script lang="ts">
	import type { PageProps } from './$types';
	import { formatNumberWithCommas } from '$lib/utils';
	import FiltersAndSort from './filter-and-sort.svelte';
	import ProductCard from './product-card.svelte';

	const { data }: PageProps = $props();
	const seoData = data.seo;
	const filters = data.filters;


</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} name="description" />
</svelte:head>

<section class="g-px flex gap-6">

	<!--	Filter and Sort -->
	<div class="hidden xl:block">
		<FiltersAndSort {filters} />
	</div>

	<!--	main content -->
	<div class="flex flex-col gap-6 flex-1">

		<!-- Page heading -->
		<div class="flex items-center gap-2">
			<h4 class="font-bold text-2xl leading-8">Search results for beds</h4>
			<span class="text-muted-foreground">{formatNumberWithCommas(1500)}+ items found</span>
		</div>

		<!--	Product items -->
		<section class="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 md:grid-cols-3 xl:grid-cols-4">
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
		</section>
	</div>
</section>

