<script lang="ts">
    import type {PageProps} from "./$types";
    import {formatNumberWithCommas, setRouteParams} from "$lib/utils";
    import FiltersAndSort from "./filter-and-sort.svelte";
    import ProductCard from "./product-card.svelte";
    import ContactUs from "$lib/components/contact-us.svelte";
    import {page} from "$app/state";
    import {ITEMS_PER_PAGE_OPTIONS} from "$lib/constants";
    import {Content, Item, Root, Trigger} from "$lib/components/ui/select";
    import {
        Content as PaginationContent,
        Ellipsis as PaginationEllipsis,
        Item as PaginationItem,
        Link as PaginationLink,
        NextButton as PaginationNextButton,
        PrevButton as PaginationPrevButton,
        Root as PaginationRoot
    } from "$lib/components/ui/pagination/index.js";
    import EmptySearch from "$lib/components/empty-search.svelte";
    import {
        Content as SheetContent,
        Overlay as SheetOverlay,
        Root as SheetRoot,
        Trigger as SheetTrigger
    } from "$lib/components/ui/sheet/index.js";
    import EmptyProduct from "$lib/components/empty-product.svelte";
    import CaretIcon from "$lib/assets/caret-up.svg";
    import FilterIcon from "$lib/assets/filter.svg";
    import {MediaQuery, SvelteURLSearchParams} from "svelte/reactivity";
    import {onMount} from "svelte";
    import type {PageI, ProductI} from "$lib/interfaces";
    import {goto} from "$app/navigation";
    import ProductCategories from "../_home/product-categories.svelte";
    import {Link, Page} from "$lib/components/ui/breadcrumb";
    import {
        Item as BreadcrumbItem,
        List as BreadcrumbList,
        Root as BreadcrumbRoot,
        Separator as BreadcrumbSeparator
    } from "$lib/components/ui/breadcrumb/index.js";

    const mediaQuery = new MediaQuery("max-width: 63.9rem");
	const { data }: PageProps = $props();
	const seoData = $derived(data.seo);
	const filters = $derived(data.filters);
	const searchTerm = $derived(page.url.searchParams.get("q") || "");
	const products = $derived(data.products);
	const isMobile = $derived(mediaQuery.current);

	// Page state
	let openFilters = $state(false);
	const itemsPerPageOptions = $state([...ITEMS_PER_PAGE_OPTIONS]);
	let itemsPerPage = $state(page.url.searchParams.get("perPage") || "10");
	let currentPage = $derived(parseInt(page.url.searchParams.get("page") ?? "1"));
	let totalProducts = $derived(data.totalProducts ?? 0);
	const moreThanAPage = $derived(totalProducts / +itemsPerPage > 1);

    const homePageData = data.homepage as PageI;
    const productCategoriesData = homePageData.contentSections.find(
        (item) => item.sectionId === "categories"
    );

    const getPreviousRoute = $derived(() => {
        const routeName = page.url.searchParams.get("route") ?? "";
       let name = "";
       let route =  "";

       if (routeName === "/") {
              name = "Home";
              route = "/";
         } else  {
           name = routeName?.split("/")[1]
           route = routeName
       }

       return {
           name,
           route
       }
    })

    $inspect(getPreviousRoute())

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
			price: product.price,
			oldPrice: product.oldPrice,
			inventory: product.inventory,
			averageRating: product.averageRating,
			reviewCount: product.reviewCount
		};

		const params = new SvelteURLSearchParams();
		for (const [key, value] of Object.entries(opData)) {
			if (value !== undefined) {
				params.append(key, value.toString());
			}
		}
		goto(`/shop/${product.slug}?${params.toString()}`);
	};

	onMount(() => {
		setParams();
	});
</script>

<svelte:head>
	<title>{seoData.metaTitle}</title>
	<meta content={seoData.metaDescription} name="description" />
</svelte:head>

<div class="flex flex-col gap-10">
    <!-- Breadcrumbs -->
    <BreadcrumbRoot class="g-px mb-6">
        <BreadcrumbList>
            <BreadcrumbItem>
                <Link class="capitalize" href={getPreviousRoute().route}>{getPreviousRoute().name}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <Page class="font-bold">Search results</Page>
            </BreadcrumbItem>
        </BreadcrumbList>
    </BreadcrumbRoot>


    {#if !searchTerm}
    <div class="g-px g-mb -mt-12">
    <ProductCategories {productCategoriesData} />
    </div>
        {/if}

	<section class="flex gap-6 g-px">

		<!-- Desktop Filter and Sort -->
		<div class="hidden lg:block">
			<FiltersAndSort {filters} />
		</div>

		<!--	main content -->
		<div class="flex flex-1 flex-col gap-6">
			<!--	Mobile Filter and Sort sheet -->
			<SheetRoot bind:open={openFilters}>
				{#if isMobile}
					<SheetTrigger
						class="-mb-4 flex cursor-pointer items-center gap-1 font-semibold text-primary"
					>
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
			{#if searchTerm}
				<div class="flex items-center gap-2">
					<h4 class="leading-8 font-bold md:text-2xl">Search results for {searchTerm}</h4>
					<span class="text-xs text-muted-foreground sm:text-sm md:text-base"
						>
                        {#if totalProducts > 1}
                        {formatNumberWithCommas(totalProducts-1)}
						+ items found
                            {:else if totalProducts === 0}
                            No items found
                            {:else}
                            1 item found
                            {/if}
                    </span
					>
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


            <!--	Product items -->
			<section class="flex flex-col gap-5 md:gap-7 xl:gap-10">
				<div
					class="grid grid-cols-2 gap-4 gap-y-8 sm:gap-6 md:grid-cols-3 md:gap-y-12 xl:grid-cols-4"
				>
					{#each products as product (product.SKU)}
						<button onclick={() => viewProductDetails(product)} class="cursor-pointer">
							<ProductCard {...product} />
						</button>
					{/each}
				</div>

				<!-- Items per page and pagination -->
				<div class="mt-6 flex items-center justify-between gap-4 md:mt-8 xl:mt-10">
					<!--	Items per page select -->
                    {#if products.length >0}
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
		</div>
	</section>
	<!--	Contact us -->
	<ContactUs />
</div>
