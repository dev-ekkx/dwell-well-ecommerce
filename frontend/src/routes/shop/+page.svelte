<script lang="ts">
	import type { PageProps } from './$types';
	import FiltersAndSort from './filter-and-sort.svelte';

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
	<FiltersAndSort {filters} />

	<!--	main content -->
</section>

