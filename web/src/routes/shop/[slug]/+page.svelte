<script lang="ts">
	import type { PageProps } from "./$types";
	import {
		Item,
		Link,
		List as BreadcrumbList,
		Page,
		Root as BreadcrumbRoot,
		Separator
	} from "$lib/components/ui/breadcrumb/index.js";
	import { type ConfigI, StarRating } from "@dev-ekkx/svelte-star-rating";

    import { Button } from "$lib/components/ui/button";
	import { MediaQuery } from "svelte/reactivity";
	import { Content, List, Root, Trigger } from "$lib/components/ui/tabs/index";
	import RelatedProducts from "./related-products.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { cn, renderMarkdown } from "$lib/utils";
    import {onMount} from "svelte";
    import {recentlyViewedStore} from "$lib/store/recently-viewed-store.svelte";
    import type {ProductI} from "$lib/interfaces";

	const mediaQuery = new MediaQuery("max-width: 63.9rem");
	const buttonQuantityClass = "cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

	let { data }: PageProps = $props();
	const isMobile = $derived(mediaQuery.current);
	const product = $derived(data.product);
	let productDescription = $derived(renderMarkdown(product.description));
	let productDetails = $derived(renderMarkdown(product.details));
	let productSpecifications = $derived(renderMarkdown(product.specifications));
	let productQuantity = $state(1);
	let selectedImageIndex = $state(0);

	const tabTitles = $state(["Product details", "Specifications", "Reviews"]);

	const groupedTabs = $derived(() => {
		return tabTitles.map((title) => {
			return {
				title,
				content:
					title === "Product details"
						? productDetails
						: title === "Specifications"
							? productSpecifications
							: "No Reviews content"
			};
		});
	});

	function increaseQuantity() {
		if (productQuantity < product.inventory) {
			productQuantity += 1;
		}
	}

	function decreaseQuantity() {
		if (productQuantity > 1) {
			productQuantity -= 1;
		}
	}

	function handlePreviewImage(index: number) {
		selectedImageIndex = index;
	}

	const config = $derived<ConfigI>({
		readonly: true,
		maxVal: 5,
		minVal: 0,
		step: 0.1,
		numOfStars: 5,
		starConfig: {
			size: isMobile ? 16 : 20,
			filledColor: "#F98416",
			unfilledColor: "#5D5D5D"
		},
		styles: {
			containerStyles: "width: max-content; pointer-events: none;",
			starStyles: "gap: 0.2rem"
		}
	});

    onMount(() => {
        recentlyViewedStore.addProduct(product)
    })
</script>

<div class="flex flex-col gap-4 g-px g-pb">
	<!-- Breadcrumbs -->
	<BreadcrumbRoot>
		<BreadcrumbList>
			<Item>
				<Link href="/shop">Shop</Link>
			</Item>
			<Separator />
			<Item>
				<Page class="font-bold">{product.name}</Page>
			</Item>
		</BreadcrumbList>
	</BreadcrumbRoot>

	<div class="g-py">
		<!-- Product Details -->
		<section class="grid gap-10 xl:grid-cols-2">
			<!-- images -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-10 xl:gap-6">
				<!--- Preview image -->
				<img
					alt={product.images[selectedImageIndex].alternativeText}
					class="aspect-square max-w-full rounded-lg object-cover md:col-span-4"
					src={product.images[selectedImageIndex].url}
				/>

				<!--- Images list --->
				<div class="flex flex-row gap-6 md:flex-col">
					{#each product.images.slice(0, 4) as image, index (image.url)}
						{#if index !== selectedImageIndex}
							<button class=" cursor-pointer" onclick={() => handlePreviewImage(index)}>
								<img
									alt={image.alternativeText}
									class="aspect-square h-auto w-[4.5rem] rounded-lg object-cover md:w-full"
									src={image.url}
								/>
							</button>
						{/if}
					{/each}
				</div>
			</div>

			<!-- Details -->
			<section class="flex flex-col gap-4">
				<div
					class="line-clamp-1 flex flex-col gap-4 text-2xl leading-8 font-semibold sm:text-3xl sm:leading-10 xl:text-4xl xl:leading-12"
				>
					<!-- Product name and coming soon tag -->
					<div class="flex items-center gap-4">
						<h3>{product.name}</h3>
						{#if product.inventory < 1}
							<Badge variant="secondary">Coming soon</Badge>
						{/if}
					</div>
					{#if product.price > 0}
						<span>${Number(product.price).toFixed(2)}</span>
					{/if}
				</div>

				<!-- Rating and reviews -->
				<div class="flex items-center gap-4">
					<StarRating {config} value={product.averageRating} />
					<div class="flex items-center gap-1 text-xs text-muted-foreground md:text-sm">
						<span>({product.averageRating} stars)</span>
						<span class="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
						<span>{product.reviewCount} reviews</span>
					</div>
				</div>
				{#if product.inventory > 0}
					<span class="font-semibold">{product.inventory} Available products</span>
				{/if}
				<p class="text-sm text-muted-foreground md:text-base">{@html productDescription}</p>
				<!-- Colors -->
				<div class="flex flex-col gap-2">
					<span class="font-semibold">Available colors</span>
					<div
						class={cn("flex items-center gap-4", {
							"pointer-events-none": product.inventory < 1
						})}
					>
						{#each product.colors as color}
							<button
								class="h-8 w-8 cursor-pointer rounded-full border-2 border-muted-foreground transition-all duration-200 ease-linear hover:scale-105"
								style="background-color: {`#${color.hex_code}`};"
								aria-label={color.name}
							></button>
						{/each}
					</div>
				</div>

				{#if product.inventory > 0}
					<!-- Quantity -->
					<div class="flex flex-col gap-2">
						<span class="font-semibold">Quantity</span>
						<div
							class="flex w-max items-center gap-2 rounded-md border **:px-3 **:py-1 **:text-center **:text-lg **:font-semibold"
						>
							<button
								class={buttonQuantityClass}
								disabled={productQuantity <= 1}
								onclick={decreaseQuantity}
							>
								-
							</button>
							<span class="w-10">{productQuantity}</span>
							<button
								class={buttonQuantityClass}
								disabled={productQuantity >= product.inventory}
								onclick={increaseQuantity}
								>+
							</button>
						</div>
					</div>

					<!-- Order or add to cart -->
					<div class="mt-6 flex flex-col gap-2 **:cursor-pointer md:flex-row md:gap-4">
						<Button>Order now</Button>
						<Button class="border-primary text-primary" variant="outline">Add to cart</Button>
					</div>
				{/if}
			</section>
		</section>

		<!-- Details, Specifications, and Reviews Tabs -->
		<section class="mt-10 xl:mt-0">
			<Root class="mt-4 w-full" value={tabTitles[0]}>
				<!--Showroom (tab) list and triggers-->
				<List
					class="flex h-max w-full max-w-2xl justify-baseline gap-2 overflow-x-auto scrollbar-hidden"
				>
					{#each tabTitles as tab (tab)}
						<Trigger
							value={tab}
							class="max-w-max rounded-none border-b-2 py-2 capitalize transition-colors hover:border-b-primary data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
						>
							{tab}
						</Trigger>
					{/each}
				</List>

				<!--Showroom (tab) content-->
				{#each groupedTabs() as group (group.title)}
					<Content value={group.title} class="py-4">
						<div class=" cms-content **:text-muted-foreground">
							{@html group.content}
						</div>
					</Content>
				{/each}
			</Root>
		</section>
	</div>
	<!-- Related products -->
	<RelatedProducts {...data.relatedProducts} />
</div>

<style>
	.cms-content :global(h2),

    /* --- Title style --- */
    .cms-content :global(h3) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid #e2e8f0;
		padding-bottom: 0.5rem;
	}

	/* --- List Styles --- */
	.cms-content :global(ul) {
		list-style-type: disc;
		margin-left: 1.5rem;
		margin-bottom: 1rem;
	}

	.cms-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.cms-content :global(li p) {
		margin-bottom: 0;
	}

	/* --- Table Styles --- */
	.cms-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	.cms-content :global(th),
	.cms-content :global(td) {
		border: 1px solid #cbd5e1;
		padding: 0.75rem;
		text-align: left;
	}

	.cms-content :global(th) {
		background-color: #f8fafc;
		font-weight: 600;
	}

	.cms-content :global(tr:nth-child(even)) {
		background-color: #f8fafc;
	}
</style>
