<script lang="ts">
	import { cn, setRouteParams } from "$lib/utils.js";
	import CaretUp from "$lib/assets/caret-up.svg";
	import { Item, Root } from "$lib/components/ui/radio-group/index.js";
	import FilterDropdown from "$lib/components/filter-dropdown.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import gsap from "gsap";
	import { onMount, tick } from "svelte";
	import { page } from "$app/state";

	const { filters: filterOptions } = $props();

	let isFiltersOpen = $state(true);
	let isSortingOpen = $state(true);
	let filtersContainer = $state<HTMLElement | null>(null);
	let sortingContainer = $state<HTMLElement | null>(null);

	const sortingItems = [
		{ label: "Newest Arrivals", value: "newest" },
		{ label: "Price: Low to High", value: "price-asc" },
		{ label: "Price: High to Low", value: "price-desc" },
		{ label: "Name: A to Z", value: "name-asc" },
		{ label: "Name: Z to A", value: "name-desc" }
	];

	// Initial filter and sort states
	let maxSlideValue = $state(filterOptions.priceRange.max);
	let sort = $state("");
	let filters = $state({
		categories: [""],
		sizes: [""],
		styles: [""],
		availabilities: [""],
		priceRange: [filterOptions.priceRange.min, filterOptions.priceRange.max]
	});

	const toggleContainer = async (
		container: HTMLElement | null,
		isOpen: boolean,
		setOpen: (value: boolean) => void
	) => {
		if (!container) return;

		const duration = 0.4;
		const ease = "power4.out";

		if (isOpen) {
			gsap.to(container, {
				height: "4rem",
				duration,
				ease,
				onComplete: () => setOpen(false)
			});
		} else {
			gsap.set(container, { clearProps: "height,opacity" });
			setOpen(true);
			await tick();
			gsap.from(container, { height: 0, duration, ease });
		}
	};

	const filtersToggle = () =>
		toggleContainer(filtersContainer, isFiltersOpen, (v) => (isFiltersOpen = v));

	const sortingToggle = () =>
		toggleContainer(sortingContainer, isSortingOpen, (v) => (isSortingOpen = v));

	const buildFilterParams = () => {
		const params: Record<string, string> = {};
		for (const [key, value] of Object.entries(filters)) {
			if (Array.isArray(value) && value.length > 0) {
				params[key] = value.join(",");
			}
		}
		return params;
	};

	const appyFilterAndSort = async () => {
		const params = buildFilterParams();
		await setRouteParams({ ...params, sort, page: 1 }, true);
	};

	const resetFilterAndSorting = async () => {
		sort = "";
		filters = {
			categories: [""],
			sizes: [""],
			styles: [""],
			availabilities: [""],
			priceRange: [filterOptions.priceRange.min, filterOptions.priceRange.max]
		};
		const params = buildFilterParams();
		await setRouteParams({ ...params, sort, q: "", priceRange: "" }, true);
	};

	const getNumberArrayParam = (params: URLSearchParams, key: string): number[] => {
		const value = params.get(key);
		return value
			? value.split(",").map(Number)
			: [filterOptions.priceRange.min, filterOptions.priceRange.max];
	};

	onMount(() => {
		const params = page.url.searchParams;

		sort = params.get("sort") ?? "";
		filters = {
			categories: params.get("categories")?.split(",") ?? [""],
			sizes: params.get("sizes")?.split(",") ?? [""],
			styles: params.get("styles")?.split(",") ?? [""],
			availabilities: params.get("availabilities")?.split(",") ?? [""],
			priceRange: getNumberArrayParam(params, "priceRange")
		};
	});
</script>

<aside class="flex w-[14rem] flex-col gap-8">
	<!-- Filters section-->
	<section bind:this={filtersContainer} class="flex flex-col gap-6 overflow-y-clip">
		<button class="flex cursor-pointer items-center justify-between gap-4" onclick={filtersToggle}>
			<span class="text-2xl leading-8 font-bold">Filtering</span>
			<img
				alt="arrow"
				class={cn("rotate-180 transition-all duration-200 ease-linear", {
					"rotate-0": isFiltersOpen
				})}
				src={CaretUp}
			/>
		</button>
		<hr />

		<FilterDropdown
			bind:selectedOptions={filters.categories}
			options={filterOptions.categories}
			title="categories"
		/>
		<FilterDropdown
			bind:selectedOptions={filters.sizes}
			options={filterOptions.sizes}
			title="size & dimensions"
		/>
		<FilterDropdown
			bind:selectedOptions={filters.availabilities}
			options={filterOptions.availabilities}
			title="availability"
		/>
		<FilterDropdown
			bind:selectedOptions={filters.styles}
			options={filterOptions.styles}
			title="style & design"
		/>

		<FilterDropdown
			bind:selectedSlides={filters.priceRange}
			{maxSlideValue}
			title="Pricing"
			type="slider"
		/>
	</section>

	<!-- Sorting section -->
	<section bind:this={sortingContainer} class="flex flex-col gap-6 overflow-y-clip">
		<button class="flex cursor-pointer items-center justify-between gap-4" onclick={sortingToggle}>
			<span class="text-2xl leading-8 font-bold">Sorting</span>
			<img
				alt="arrow"
				class={cn("rotate-180 transition-all duration-200 ease-linear", {
					"rotate-0": isSortingOpen
				})}
				src={CaretUp}
			/>
		</button>

		<hr />

		<Root bind:value={sort}>
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

	<!--		Apply and  filters button-->
	<div class="flex flex-col gap-4">
		<Button class="cursor-pointer" onclick={appyFilterAndSort}>Apply</Button>
		<Button
			class="cursor-pointer border-primary text-primary"
			onclick={resetFilterAndSorting}
			variant="outline"
			>Clear Filters
		</Button>
	</div>
</aside>
