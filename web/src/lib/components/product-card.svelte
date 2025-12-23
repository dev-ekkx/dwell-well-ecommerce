<script lang="ts">
	import CartIcon from "$lib/assets/cart.svg";
	import { Badge } from "$lib/components/ui/badge";
	import type { ProductI, ProductSummaryI } from "$lib/interfaces";
	import { cartStore } from "$lib/store/cart-store.svelte.js";
	import { formatNumberWithCommas } from "$lib/utils";
	import { type ConfigI, StarRating } from "@dev-ekkx/svelte-star-rating";
	import { MediaQuery } from "svelte/reactivity";

	const { product, trigger }: { product: ProductSummaryI | ProductI; trigger?: () => void } =
		$props();
	const mediaQuery = new MediaQuery("max-width: 63.9rem");
	const isMobile = $derived(mediaQuery.current);
	const productImage = $derived(`${product.images[0].url}`);

	const config = $derived<ConfigI>({
		readonly: true,
		maxVal: 5,
		minVal: 0,
		step: 0.1,
		numOfStars: 5,
		starConfig: {
			size: isMobile ? 11 : 14,
			filledColor: "#F98416",
			unfilledColor: "#5D5D5D"
		},
		styles: {
			containerStyles: "width: max-content; pointer-events: none;",
			starStyles: "gap: 0.1rem"
		}
	});

	function addToCart() {
		cartStore.addToCart(product as unknown as ProductI);
	}
</script>

<div class="group relative flex flex-col gap-4">
	<!-- Product action trigger button -->
	<button
		aria-label="handle product action"
		class="absolute top-0 left-0 z-10 h-full w-full cursor-pointer"
		onclick={trigger}
	></button>
	<!--Add to cart button -->
	{#if product.inventory > 0}
		<button
			class="absolute top-2 right-2 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary"
			onclick={addToCart}
		>
			<img alt="cart" class="scale-75" src={CartIcon} />
		</button>
	{/if}

	<div class="relative h-[11rem] overflow-clip rounded-lg md:h-[13rem]">
		<img
			alt={product.name}
			class="h-full w-full object-cover transition-all duration-200 ease-linear group-hover:scale-110"
			src={productImage}
		/>

		{#if product.inventory === 0 || product?.productStatus === "INACTIVE"}
		<Badge
		class="absolute top-1 left-0 border-primary bg-muted font-semibold text-primary"
		variant="outline">Currently unavailable</Badge
		>
		{/if}
	</div>

	<div class="flex flex-col gap-1">
		<span class="text-left text-xl leading-7 font-semibold">{product.name}</span>
		{#if product.averageRating > 0}
			<span class="flex items-center gap-1">
				<StarRating bind:value={product.averageRating} {config} />
				<span class="text-sm text-muted-foreground"
					>{product.averageRating} ({product.reviewCount} Reviews)</span
				>
			</span>
		{/if}
		<span class="flex items-center gap-1 text-xl leading-7 font-bold">
			{#if (product?.oldPrice ?? 0) > 0}
				<span class="text-muted-foreground line-through"
					>${formatNumberWithCommas(product?.oldPrice ?? 0)}</span
				>
			{/if}
			{#if product.price > 0 && product?.productStatus === "ACTIVE"}
				<span class="text-lg">${formatNumberWithCommas(product?.price ?? 0)} </span>
			{/if}
		</span>
	</div>
</div>
