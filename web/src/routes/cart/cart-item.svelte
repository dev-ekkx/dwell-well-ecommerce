<script lang="ts">
	import { cn, formatNumberWithCommas } from "$lib/utils";
	import WarningCircleIcon from "$lib/assets/warning-circle.svg";
	import TrashIcon from "$lib/assets/trash.svg";
	import MinusIcon from "$lib/assets/minus.svg";
	import PlusIcon from "$lib/assets/plus.svg";
	import { Button } from "$lib/components/ui/button";
	import { MediaQuery } from "svelte/reactivity";
	import { cartStore } from "$lib/store/cart-store.svelte";

	const item = $props();

	const mediaQuery = new MediaQuery("max-width: 47.9rem");
	const isMobile = $derived(mediaQuery.current);

	const quantityTriggerClass =
		"p-1.5 hover:shadow-md hover:scale-105 hover:opacity-90 transition-all duration-150 ease-linear";

	function increaseQuantity() {
		cartStore.increaseQuantity(item.SKU);
	}
</script>

<div
	class="flex flex-col gap-4 rounded-lg border border-b-muted-foreground/20 p-4 shadow-sm shadow-muted-foreground/20"
>
	<!-- Image, price and description -->
	<div class="flex items-center gap-4">
		<div class="relative h-20 w-24 overflow-clip rounded">
			<img alt={item.name} class=" h-full w-full object-cover" src={item.image.url} />
			{#if isMobile}
				<span
					class="absolute top-0 right-0 rounded-sm bg-primary-foreground p-1 text-xs font-semibold text-primary"
					>-42%</span
				>
			{/if}
		</div>
		<div class="flex flex-col gap-1">
			<span>{item.name}</span>
			{#if isMobile}
				<div class="flex flex-wrap items-center gap-2 font-medium">
					<span class=" text-xl">${formatNumberWithCommas(12_240.96)}</span>
					<span class="text-muted-foreground line-through"
						>${formatNumberWithCommas(15_680.82)}</span
					>
				</div>
			{/if}
			{#if !item.inventory || item.inventory < 5}
				<div class="flex items-center gap-1 text-sm text-warning">
					<img alt="warning" class="scale-90" src={WarningCircleIcon} />
					<span>few units left</span>
				</div>
			{/if}
		</div>
		{#if !isMobile}
			<div class="ml-auto flex flex-col gap-1 font-medium">
				<span class=" text-2xl">${formatNumberWithCommas(12_240.96)}</span>

				<div class="flex items-center gap-4">
					<span class="text-muted-foreground line-through"
						>${formatNumberWithCommas(15_680.82)}</span
					>
					<span
						class="w-max rounded-sm bg-primary-foreground p-1 text-xs font-semibold text-primary"
						>-42%</span
					>
				</div>
			</div>
		{/if}
	</div>

	<!-- Remove button and quantity triggers -->
	<div class="flex items-center justify-between gap-4">
		<!-- Remove button -->
		<Button
			class="flex cursor-pointer items-center gap-2 text-primary hover:text-primary"
			onclick={() => cartStore.removeFromCart(item.SKU)}
			variant="ghost"
		>
			<img alt="trash" src={TrashIcon} />
			{#if !isMobile}
				<span>Remove</span>
			{/if}
		</Button>

		<!-- Quantity triggers -->
		<div class="flex items-center gap-2 overflow-clip rounded-md">
			<button
				aria-label="decrease item quantity"
				class={cn("cursor-pointer bg-primary disabled:pointer-events-none", quantityTriggerClass, {
					"bg-muted-foreground": item.quantity === 1
				})}
				disabled={item.quantity === 1}
				onclick={() => cartStore.reduceQuantity(item.SKU)}
			>
				<img alt="minus" src={MinusIcon} />
			</button>
			<span class={cn("pointer-events-none", quantityTriggerClass)}>{item.quantity}</span>
			<button
				aria-label="increase item quantity"
				class={cn("cursor-pointer bg-primary", quantityTriggerClass)}
				onclick={increaseQuantity}
			>
				<img alt="plus" src={PlusIcon} />
			</button>
		</div>
	</div>
</div>
