<script lang="ts">
    import {formatNumberWithCommas} from "$lib/utils";
    import {type ConfigI, StarRating} from "@dev-ekkx/svelte-star-rating";
    import CartIcon from "$lib/assets/cart.svg";
    import {Badge} from "$lib/components/ui/badge";
    import type {ProductI} from "$lib/interfaces";
    import {MediaQuery} from "svelte/reactivity";

    const mediaQuery = new MediaQuery("max-width: 63.9rem");
    const isMobile = $derived(mediaQuery.current);
    const product: ProductI = $props();
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
</script>

<div class="group relative flex flex-col gap-4">
    <!--	add to cart button-->
    {#if product.price > 0}
        <button
                class="absolute top-4 right-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary"
        >
            <img alt="cart" class="scale-75" src={CartIcon}/>
        </button>
    {/if}

    <div class="h-[11rem] overflow-clip rounded-lg md:h-[12rem]">
        <img
                alt={product.name}
                class="h-full w-full object-cover transition-all duration-200 ease-linear group-hover:scale-110"
                src={productImage}
        />
    </div>

    <div class="flex flex-col gap-1">
        <span class="text-left text-xl leading-7 font-semibold">{product.name}</span>
        {#if product.averageRating > 0}
			<span class="flex items-center gap-1">
				<StarRating bind:value={product.averageRating} {config}/>
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
            {#if product.price > 0}
				<span class="">${formatNumberWithCommas(299)} </span>
			{:else}
				<Badge variant="primary">Coming soon</Badge>
			{/if}
		</span>
    </div>
</div>
