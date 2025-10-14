<script lang="ts">
	import { cn } from '$lib/utils.js';
	import CaretUp from '$lib/assets/caret-up.svg';
	import { Item, Root } from '$lib/components/ui/radio-group/index.js';
	import FilterDropdown from '$lib/components/filter-dropdown.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import gsap from 'gsap';
	import { tick } from 'svelte';

	const { filters } = $props();

	let isFiltersOpen = $state(true);
	let isSortingOpen = $state(true);
	let filtersContainer = $state<HTMLElement | null>(null);
	let sortingContainer = $state<HTMLElement | null>(null);

	const sortingItems = [
		{ label: 'Newest Arrivals', value: 'newest' },
		{ label: 'Price: Low to High', value: 'price-asc' },
		{ label: 'Price: High to Low', value: 'price-desc' },
		{ label: 'Name: A to Z', value: 'name-asc' },
		{ label: 'Name: Z to A', value: 'name-desc' }
	];

	// Initial filter states
	let selectedCategories = $state<string[]>([]);
	let selectedSizes = $state<string[]>([]);
	let selectedAvailabilities = $state<string[]>([]);
	let selectedStyles = $state<string[]>([]);
	let maxSlideValue = $state(5000);
	let selectedPriceRange = $state<[number, number]>([0, 5000]);
	let selectedSorting = $state('');


	const toggleContainer = async (
		container: HTMLElement | null,
		isOpen: boolean,
		setOpen: (value: boolean) => void
	) => {
		if (!container) return;

		const duration = 0.4;
		const ease = 'power4.out';

		if (isOpen) {
			gsap.to(container, {
				height: '4rem',
				duration,
				ease,
				onComplete: () => setOpen(false)
			});
		} else {
			gsap.set(container, { clearProps: 'height,opacity' });
			setOpen(true);
			await tick();
			gsap.from(container, { height: 0, duration, ease });
		}
	};

	const filtersToggle = () =>
		toggleContainer(filtersContainer, isFiltersOpen, (v) => (isFiltersOpen = v));

	const sortingToggle = () =>
		toggleContainer(sortingContainer, isSortingOpen, (v) => (isSortingOpen = v));

	const resetFilterAndSorting = () => {
		selectedCategories = [];
		selectedSizes = [];
		selectedAvailabilities = [];
		selectedStyles = [];
		selectedPriceRange = [0, 5000];
		selectedSorting = '';
	};
</script>

<aside class="flex flex-col gap-8 w-[14rem]">
	<!-- Filters section-->
	<section bind:this={filtersContainer} class="flex flex-col gap-6 overflow-y-clip">
		<button class="flex items-center justify-between gap-4 cursor-pointer" onclick={filtersToggle}>
			<span class="font-bold text-2xl leading-8">Filtering</span>
			<img alt="arrow" class={cn('transition-all duration-200 ease-linear rotate-180', {
			'rotate-0': isFiltersOpen,
		})} src={CaretUp}>
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
			{maxSlideValue}
			title="Pricing"
			type="slider"
		/>
	</section>

	<!-- Sorting section -->
	<section bind:this={sortingContainer} class="flex flex-col gap-6 overflow-y-clip">
		<button class="flex items-center justify-between gap-4 cursor-pointer" onclick={sortingToggle}>
			<span class="font-bold text-2xl leading-8">Sorting</span>
			<img alt="arrow" class={cn('transition-all duration-200 ease-linear rotate-180', {
			'rotate-0': isSortingOpen,
		})} src={CaretUp}>
		</button>

		<hr />

		<Root bind:value={selectedSorting}>
			<div class="flex flex-col gap-4">
				{#each sortingItems as item (item.value)}
					<div class="flex items-center space-x-2 **:cursor-pointer">
						<Item value={item.value} id={item.value} />
						<Label for={item.value}>{item.label}</Label>
					</div>
				{/each}
			</div>
		</Root>
	</section>

	<!--		Clear filters button-->
	<Button class="text-primary border-primary cursor-pointer" onclick={resetFilterAndSorting} variant="outline">Clear
		Filters
	</Button>
</aside>