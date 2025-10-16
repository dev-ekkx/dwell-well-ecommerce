<script lang="ts">
	import type { PageProps } from './$types';
	import { formatNumberWithCommas } from '$lib/utils';
	import FiltersAndSort from './filter-and-sort.svelte';
	import ProductCard from './product-card.svelte';
	import ContactUs from '$lib/components/contact-us.svelte';
	import { ITEMS_PER_PAGE_OPTIONS } from '$lib/constants';
	import { Content, Item, Root, Trigger } from '$lib/components/ui/select';
	import {
		Content as PaginationContent,
		Ellipsis as PaginationEllipsis,
		Item as PaginationItem,
		Link as PaginationLink,
		NextButton as PaginationNextButton,
		PrevButton as PaginationPrevButton,
		Root as PaginationRoot
	} from '$lib/components/ui/pagination/index.js';

	import {
		Content as DrawerContent,
		Overlay as DrawerOverlay,
		Root as DrawerRoot,
		Trigger as DrawerTrigger
	} from '$lib/components/ui/drawer/index.js';

	import CaretIcon from '$lib/assets/caret-up.svg';
	import FilterIcon from '$lib/assets/filter.svg';
	import { MediaQuery } from 'svelte/reactivity';

	const { data }: PageProps = $props();
	const seoData = data.seo;
	const filters = data.filters;

	const mediaQuery = new MediaQuery('max-width: 63.9rem');
	const isMobile = $derived(mediaQuery.current);

	// Page state
	let isDrawerOpen = $state(false);
	const itemsPerPageOptions = $state([...ITEMS_PER_PAGE_OPTIONS]);
	let itemsPerPage = $state('10');
	let currentPage = $state(1);
	let products = $state(Array.from({ length: 32 }, (_, i) => ({
		id: i + 1,
		name: `Product ${i + 1}`
	})));
	let totalItems = $derived(products.length);

	// Slice products for current page
	const startIndex = $derived((currentPage - 1) * +itemsPerPage);
	const endIndex = $derived(startIndex + +itemsPerPage);
	const currentProducts = $derived(products.slice(startIndex, endIndex));


</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} name="description" />
</svelte:head>

<div class="flex flex-col gap-10">
	<section class="g-px flex gap-6">
		<!-- Desktop Filter and Sort -->
		<div class="hidden lg:block">
			<FiltersAndSort {filters} />
		</div>

		<!--	main content -->
		<div class="flex flex-col gap-6 flex-1">
			<!--	Mobile Filter and Sort Drawer -->
			<DrawerRoot bind:open={isDrawerOpen}>
				<DrawerTrigger class="flex items-center gap-1 text-primary cursor-pointer font-semibold">
					<img alt="filter" src={FilterIcon}>
					<span>Toggle filters</span>
				</DrawerTrigger>
				<DrawerContent class="w-max h-max bg-red-600 p-4 overflow-y-scroll">
					<section class="py-4 bg-blue-600">
						<FiltersAndSort {filters} />
					</section>
				</DrawerContent>

				<DrawerOverlay class="backdrop-blur-xs" />
			</DrawerRoot>

			<!-- Page heading -->
			<div class="flex items-center gap-2">
				<h4 class="font-bold md:text-2xl leading-8">Search results for beds</h4>
				<span class="text-muted-foreground text-xs sm:text-sm md:text-base">{formatNumberWithCommas(1500)}
					+ items found</span>
			</div>

			<!--	Product items -->
			<section class="flex flex-col gap-5 md:gap-7 xl:gap-10">
				<div class="grid grid-cols-2 gap-4 gap-y-8 md:gap-y-12 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
					{#each currentProducts as product (product.id)}
						<ProductCard />
					{/each}
				</div>

				<!-- Items per page and pagination -->
				<div class="flex items-center justify-between gap-4 mt-6 md:mt-8 xl:mt-10">
					<!--	Items per page select -->
					<Root bind:value={itemsPerPage} type="single">
						<Trigger class="w-16">{itemsPerPage}</Trigger>
						<Content>
							{#each itemsPerPageOptions as option(option)}
								<Item value={String(option)}>{option}</Item>
							{/each}
						</Content>
					</Root>

					<!-- Pagination -->
					<PaginationRoot bind:page={currentPage} count={totalItems} perPage={+itemsPerPage}>
						{#snippet children({ pages, currentPage })}
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevButton class="cursor-pointer">
										<img src={CaretIcon} class="-rotate-90" alt="caret-left" />
									</PaginationPrevButton>
								</PaginationItem>

								{#each pages as page (page.key)}
									{#if page.type === "ellipsis"}
										<PaginationItem>
											<PaginationEllipsis />
										</PaginationItem>
									{:else}
										<PaginationItem>
											<PaginationLink {page} isActive={currentPage === page.value}>
												{page.value}
											</PaginationLink>
										</PaginationItem>
									{/if}
								{/each}
								<PaginationItem>
									<PaginationNextButton class="cursor-pointer">
										<img src={CaretIcon} class="rotate-90" alt="caret-left" />
									</PaginationNextButton>
								</PaginationItem>
							</PaginationContent>
						{/snippet}
					</PaginationRoot>
				</div>
			</section>
		</div>
	</section>
	<!--	Contact us -->
	<ContactUs />
</div>