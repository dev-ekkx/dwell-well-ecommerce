<script lang="ts">
	import FilterDropdown from '$lib/components/filter-dropdown.svelte';
	import CaretUp from '$lib/assets/caret-up.svg';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const seoData = data.seo;
	const filters = data.filters;

	// Initial filter states
	let selectedCategories = $state<string[]>([]);
	let selectedSizes = $state<string[]>([]);
	let selectedAvailabilities = $state<string[]>([]);
	let selectedStyles = $state<string[]>([]);
	let selectedPriceRange = $state<[number, number]>([0, 1000]);

	// $inspect(
	// 	selectedCategories,
	// 	selectedSizes,
	// 	selectedAvailabilities,
	// 	selectedStyles,
	// 	selectedPriceRange
	// );
</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} name="description" />
</svelte:head>

<section class="g-px flex gap-6">

	<!--	Filter and Sort -->
	<aside class="flex flex-col gap-6 w-[14rem]">
		<!-- Filters -->
		<section class="flex flex-col gap-6">
			<button class="flex items-center justify-between gap-4">
				<span class="font-bold text-2xl leading-8">Filtering</span>
				<img alt="arrow" src={CaretUp}>
			</button>
			<hr />

			<FilterDropdown
				bind:selectedOptions={selectedCategories}
				options={filters.categories}
				title="categories"
			/>
			<FilterDropdown
				bind:selectedOptions={selectedSizes}
				options={filters.sizes}
				title="size & dimensions"
			/>
			<FilterDropdown
				bind:selectedOptions={selectedAvailabilities}
				options={filters.availabilities}
				title="availability"
			/>
			<FilterDropdown
				bind:selectedOptions={selectedStyles}
				options={filters.styles}
				title="style & design"
			/>

			<FilterDropdown
				bind:selectedSlides={selectedPriceRange}
				maxSlideValue={5000}
				title="Pricing"
				type="slider"
			/>
		</section>
	</aside>

</section>

