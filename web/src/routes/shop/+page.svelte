<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import CaretIcon from "$lib/assets/caret-up.svg";
	import FilterIcon from "$lib/assets/filter.svg";
	import ContactUs from "$lib/components/contact-us.svelte";
	import EmptyProduct from "$lib/components/empty-product.svelte";
	import EmptySearch from "$lib/components/empty-search.svelte";
	import ProductCard from "$lib/components/product-card.svelte";
	import { Link, Page } from "$lib/components/ui/breadcrumb";
	import {
		Item as BreadcrumbItem,
		List as BreadcrumbList,
		Root as BreadcrumbRoot,
		Separator as BreadcrumbSeparator
	} from "$lib/components/ui/breadcrumb/index.js";
	import {
		Content as PaginationContent,
		Ellipsis as PaginationEllipsis,
		Item as PaginationItem,
		Link as PaginationLink,
		NextButton as PaginationNextButton,
		PrevButton as PaginationPrevButton,
		Root as PaginationRoot
	} from "$lib/components/ui/pagination/index.js";
	import { Content, Item, Root, Trigger } from "$lib/components/ui/select";
	import {
		Content as SheetContent,
		Overlay as SheetOverlay,
		Root as SheetRoot,
		Trigger as SheetTrigger
	} from "$lib/components/ui/sheet/index.js";
	import { ITEMS_PER_PAGE_OPTIONS } from "$lib/constants";
	import type { PageI, ProductI } from "$lib/interfaces";
	import { formatNumberWithCommas, setRouteParams } from "$lib/utils";
	import { onMount } from "svelte";
	import { MediaQuery, SvelteURLSearchParams } from "svelte/reactivity";
	import ProductCategoriesSkeleton from "../_home/product-categories-skeleton.svelte";
	import ProductCategories from "../_home/product-categories.svelte";
	import type { PageProps } from "./$types";
	import FiltersAndSort from "./filter-and-sort.svelte";
	import ProductCategorySection from "./product-category-sections.svelte";
	import ProductsCategorySectionSkeleton from "./products-category-section-skeleton.svelte";
	import ProductsSkeleton from "./products-skeleton.svelte";

	const mediaQuery = new MediaQuery("max-width: 63.9rem");
	const { data }: PageProps = $props();
	let homePageData = $state({}) as PageI;
	let productsData = $state<{
		products: ProductI[];
		totalProducts: number;
	}>({
		products: [],
		totalProducts: 0
	});
	const seoData = $derived(homePageData?.seo ?? {})
	const filters = $derived({
		...data.filters,
		priceRange: {
			min: 0,
			max: 10_000
		}
	});
	const searchTerm = $derived(page.url.searchParams.get("q") || "");
	const products = $derived(productsData.products);
	const isMobile = $derived(mediaQuery.current);

	// Page state
	let openFilters = $state(false);
	const itemsPerPageOptions = $state([...ITEMS_PER_PAGE_OPTIONS]);
	let itemsPerPage = $state(page.url.searchParams.get("perPage") || "10");
	let currentPage = $derived(parseInt(page.url.searchParams.get("page") ?? "1"));
	let totalProducts = $derived(productsData.totalProducts);
	const moreThanAPage = $derived(totalProducts / +itemsPerPage > 1);

	onMount(async () => {
		const homepageRes = await data?.homepage
		homePageData = (await homepageRes?.json()).data[0] as PageI;
		productsData = await data?.productsData

	})

	const productCategoriesData = $derived(homePageData?.contentSections?.find(
		(item) => item.sectionId === "categories"
	))

	const isViewingCategory = $derived(() => {
		return !!page.url.searchParams.get("category");
	});

	const categoryName = $derived(() => {
		const categoryParam = page.url.searchParams.get("category") || "";
		return categoryParam.split("_").join(" ");
	});

	const getPreviousRoute = $derived(() => {
		const route = isViewingCategory() ? "/shop" : (page.url.searchParams.get("route") ?? "");

		const name = isViewingCategory()
			? "Shop"
			: route === "/"
				? "Home"
				: route === "/faqs"
					? "FAQs"
					: (route.split("/")[1] ?? route);

		return {
			name,
			route
		};
	});

	const setParams = (page?: number) => {
		setRouteParams({
			page: page ? page : currentPage,
			perPage: itemsPerPage
		});
	};

	const handleItemsPerPage = () => {
		setParams(1);
	};

	const handlePageChange = () => {
		setParams();
	};

	const viewProductDetails = (product: ProductI) => {
		const opData = {
			price: product.price || 0,
			oldPrice: product.oldPrice || 0,
			inventory: product.inventory || 0,
			averageRating: product.averageRating || 0,
			reviewCount: product.reviewCount || 0
		};

		const params = new SvelteURLSearchParams();
		for (const [key, value] of Object.entries(opData)) {
			if (value !== undefined) {
				console.log(value);
				params.append(key, value.toString());
			}
		}
		goto(`/shop/${product.slug}?${params.toString()}`);
	};

	const isFilterOrSearch = $derived(() => {
		const priceRangeFilter = (page.url.searchParams.get("priceRange") ?? "").split(",");
		const isPriceRangeFiltered =
			priceRangeFilter.length === 2 &&
			(priceRangeFilter[0] !== "0" || priceRangeFilter[1] !== "10000");
		const sort = page.url.searchParams.get("sort");
		const categoriesFilter = page.url.searchParams.get("categories")?.split(",").filter(Boolean);
		const sizesFilter = page.url.searchParams.get("sizes")?.split(",").filter(Boolean);
		const stylesFilter = page.url.searchParams.get("styles")?.split(",").filter(Boolean);
		const availabilitiesFilter = page.url.searchParams
			.get("availabilities")
			?.split(",")
			.filter(Boolean);
		return Boolean(
			searchTerm ||
				sort ||
				(categoriesFilter && categoriesFilter.length > 0) ||
				(sizesFilter && sizesFilter.length > 0) ||
				(stylesFilter && stylesFilter.length > 0) ||
				(availabilitiesFilter && availabilitiesFilter.length > 0) ||
				isPriceRangeFiltered
		);
	});

	onMount(() => {
		setParams();
	});
</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} name="description" />
</svelte:head>

<div class="flex flex-col gap-10">
	{#if isViewingCategory() || searchTerm}
		<!-- Breadcrumbs -->
		<BreadcrumbRoot class="mb-6 g-px">
			<BreadcrumbList>
				<BreadcrumbItem>
					<Link class="capitalize" href={getPreviousRoute().route}>{getPreviousRoute().name}</Link>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<Page class="font-bold capitalize"
						>{isViewingCategory() ? categoryName() : "Search results"}</Page
					>
				</BreadcrumbItem>
			</BreadcrumbList>
		</BreadcrumbRoot>
	{/if}

	{#if !(isFilterOrSearch() || isViewingCategory())}
		<div class="-mt-12 g-mb max-w-full g-px">
			{#await data.homepage}
			<ProductCategoriesSkeleton />
			{:then product}
			{#if productCategoriesData?.title}
			<ProductCategories {productCategoriesData} />
			{/if}
			{/await}
		</div>
	{/if}

	<section class="flex gap-6 g-px">
		<!-- Desktop Filter and Sort -->
		<div class="hidden lg:block">
			<FiltersAndSort {filters} />
		</div>

		<!--	main content -->
		<div class="flex max-w-full flex-col gap-6">
			<!--	Mobile Filter and Sort sheet -->
			<SheetRoot bind:open={openFilters}>
				{#if isMobile}
					<SheetTrigger class="flex cursor-pointer items-center gap-1 font-semibold text-primary">
						<img alt="filter" src={FilterIcon} />
						<span>Toggle filters</span>
					</SheetTrigger>
				{/if}
				<SheetContent class="w-max overflow-y-scroll p-4" side="left">
					<section class="mt-10">
						<FiltersAndSort {filters} />
					</section>
				</SheetContent>
				<SheetOverlay class="backdrop-blur-xs" />
			</SheetRoot>

			<!-- Page heading -->
			{#if isViewingCategory() || searchTerm}
				<div class="flex items-center gap-2">
					<h4 class="leading-8 font-bold capitalize md:text-2xl">
						{isViewingCategory() ? categoryName() : "Search results for"}
						{searchTerm}
					</h4>
					<span class="text-xs text-muted-foreground sm:text-sm md:text-base">
						{#if totalProducts > 1}
							{formatNumberWithCommas(totalProducts - 1)}
							+ items {isViewingCategory() ? null : "found"}
						{:else if totalProducts === 0}
							No items {isViewingCategory() ? null : "found"}
						{:else}
							1 item {isViewingCategory() ? null : "found"}
						{/if}
					</span>
				</div>
			{/if}
		
			<!--- Empty products --->
			{#if !searchTerm && products.length === 0}
				<EmptyProduct />
			{/if}

			<!--- Empty products for search --->
			{#if searchTerm && products.length === 0}
				<div class="flex h-[70vh] items-center justify-center">
					<EmptySearch />
				</div>
			{/if}
			
			<!-- #################### PRODUCT & PAGINATION CONTENT #################### -->
			{#if isFilterOrSearch() || isViewingCategory()}
			<!--	Product items -->
			<section class="flex flex-col gap-5 md:gap-7 xl:gap-10">
					{#await data.productsData}
				<ProductsSkeleton />
			{:then data}
			{data.totalProducts}
							<div
								class="grid grid-cols-2 gap-4 gap-y-8 sm:gap-6 md:grid-cols-3 md:gap-y-12 xl:grid-cols-4"
							>
						{#each data.products as product (product.SKU)}
							<ProductCard {product} trigger={() => viewProductDetails(product)} />
						{/each}
					</div>
					{/await}
					<!-- Items per page and pagination -->
					<div class="mt-6 flex items-center justify-between gap-4 md:mt-8 xl:mt-10">
						<!--	Items per page select -->
						{#if products.length > 0}
							<div class="flex items-center gap-4">
								<span class="w-max">Products per page:</span>
								<Root bind:value={itemsPerPage} onValueChange={handleItemsPerPage} type="single">
									<Trigger class="w-16">{itemsPerPage}</Trigger>
									<Content>
										{#each itemsPerPageOptions as option (option)}
											<Item value={String(option)}>{option}</Item>
										{/each}
									</Content>
								</Root>
							</div>
						{/if}

						<!-- Pagination -->
						{#if moreThanAPage}
							<PaginationRoot
								bind:page={currentPage}
								count={totalProducts}
								onPageChange={handlePageChange}
								perPage={+itemsPerPage}
							>
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
						{/if}
					</div>
				</section>
			{:else}

			<ProductsCategorySectionSkeleton />
				{#await data.productsData}
			<ProductsCategorySectionSkeleton />
			{:then prodData}
			<!-- Product category sections -->
			<div class="flex flex-col gap-10 md:gap-12 lg:gap-16">
				<ProductCategorySection title="New Arrivals" products={prodData.products} />
				<ProductCategorySection title="Best Sellers" products={prodData.products.slice(2)} />
				<ProductCategorySection title="Top Picks" products={prodData.products.slice(4)} />
			</div>
			{/await}
			{/if}
			<!-- #################### END OF PRODUCT & PAGINATION CONTENT #################### -->
		</div>
	</section>

	<div class="g-mt g-px">
		{#if searchTerm}
			<ProductCategorySection title="Flash Sales" products={products} isDynamicWidth={false} />
		{:else}
			<ProductCategorySection title="Recommended Items" products={products} isDynamicWidth={false} />
		{/if}
	</div>
	<!-- Contact us -->
	<ContactUs />
</div>
