<script lang="ts">
	import CheckboxDropdown from '$lib/components/check-box-dropdown.svelte';
	import CaretUp from '$lib/assets/caret-up.svg';
	import type { PageProps } from './$types';

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
	<aside class="flex flex-col gap-6 w-[12.5rem	]">
		<!-- Filters -->
		<section class="flex flex-col gap-6">
			<button class="flex items-center justify-between gap-4">
				<span class="font-bold text-2xl leading-8">Filtering</span>
				<img alt="arrow" src={CaretUp}>
			</button>

			<hr />

			<CheckboxDropdown options={filters.categories} title="categories" />
			<CheckboxDropdown options={filters.sizes} title="size & dimensions" />
			<CheckboxDropdown options={filters.availabilities} title="availability" />
			<CheckboxDropdown options={filters.styles} title="style & design" />

		</section>
	</aside>

</section>

