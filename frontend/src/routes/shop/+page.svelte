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
	import Caret from '$lib/assets/caret-up.svg';

	const { data }: PageProps = $props();
	const seoData = data.seo;
	const filters = data.filters;

	// Page state
	const itemsPerPageOptions = $state([...ITEMS_PER_PAGE_OPTIONS]);
	let itemsPerPage = $state('10');
	let currentPage = $state(1);
	let totalItems = $state(150);

	$inspect(currentPage);

</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} name="description" />
</svelte:head>

<div class="flex flex-col gap-10">
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
			<section class="flex flex-col gap-5 md:gap-7 xl:gap-10">
				<div class="grid grid-cols-2 gap-4 gap-y-8 md:gap-y-12 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
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
				</div>

				<!-- Items per page and pagination -->
				<div class="flex items-center justify-between gap-4">
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
					<PaginationRoot count={totalItems} perPage={+itemsPerPage}>
						{#snippet children({ pages, currentPage })}
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevButton class="cursor-pointer">
										<img src={Caret} class="-rotate-90" alt="caret-left" />
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
										<img src={Caret} class="rotate-90" alt="caret-left" />
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