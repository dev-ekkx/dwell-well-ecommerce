<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import EmptyCartIcon from "$lib/assets/empty-cart.svg";
	import { goto } from "$app/navigation";
	import { cn, formatNumberWithCommas } from "$lib/utils";
	import { MediaQuery } from "svelte/reactivity";
	import TrashIcon from "$lib/assets/trash.svg";
	import MinusIcon from "$lib/assets/minus.svg";
	import PlusIcon from "$lib/assets/plus.svg";
	import WarningCircleIcon from "$lib/assets/warning-circle.svg";

	const mediaQuery = new MediaQuery("max-width: 47.9rem");
	const isMobile = $derived(mediaQuery.current);

	const isEmpty = false;

	const goToShopping = () => {
		goto("/shop");
	};

	const quantityTriggerClass =
		"p-1.5 hover:shadow-md hover:scale-105 hover:opacity-90 transition-all duration-150 ease-linear";
</script>

<div class="g-mb g-px">
	{#if isEmpty}
		{@render emptyCart()}
	{:else}
		{@render cartData()}
	{/if}
</div>

{#snippet cartData()}
	<section class="flex flex-col gap-8 lg:flex-row-reverse">
		<!-- Cart summary -->
		<div
			class="flex w-full flex-col gap-4 rounded-lg border border-b-muted-foreground/20 p-4 shadow-sm shadow-muted-foreground/20 lg:w-sm xl:w-md 2xl:w-xl"
		>
			<h6 class="text-2xl font-semibold capitalize">cart summary</h6>
			<hr />
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between gap-4">
					<span>Subtotal</span>
					<span>$ {formatNumberWithCommas(10_000)}</span>
				</div>
				<div class="flex items-center justify-between gap-4">
					<span>Shipping</span>
					<span>Free</span>
				</div>
				<div class="flex items-center justify-between gap-4">
					<span>Tax</span>
					<span>$ {formatNumberWithCommas(3.5)}</span>
				</div>
			</div>
		</div>

		<!-- Cart items -->
		<div class="flex flex-1 flex-col gap-4">
			<!-- Card item -->
			<div
				class="flex flex-col gap-4 rounded-lg border border-b-muted-foreground/20 p-4 shadow-sm shadow-muted-foreground/20"
			>
				<!-- Image, price and description -->
				<div class="flex items-center gap-4">
					<!-- TODO: Remove image placeholder -->
					<div class="relative h-18 w-24 bg-muted-foreground">
						{#if isMobile}
							<span
								class="absolute right-0 rounded-sm bg-primary-foreground p-1 text-xs font-semibold text-primary"
								>-42%</span
							>
						{/if}
					</div>
					<div class="flex flex-col gap-1">
						<span
							>Asano 32" - 32DF2 Smart Android TV - Frameless Screen - USB - HDMI - Black+12 Months
							Warranty</span
						>
						{#if isMobile}
							<div class="flex items-center gap-2 font-medium">
								<span class=" text-xl">${formatNumberWithCommas(12_240.96)}</span>
								<span class="text-muted-foreground line-through"
									>${formatNumberWithCommas(15_680.82)}</span
								>
							</div>
						{/if}
						<div class="flex items-center gap-1 text-sm text-warning">
							<img src={WarningCircleIcon} class="scale-90" alt="warning" />
							<span>few units left</span>
						</div>
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
						variant="ghost"
						class="flex cursor-pointer items-center gap-2 text-primary hover:text-primary"
					>
						<img src={TrashIcon} alt="trash" />
						{#if !isMobile}
							<span>Remove</span>
						{/if}
					</Button>

					<!-- Quantity triggers -->
					<div class="flex items-center gap-2 overflow-clip rounded-md">
						<button
							aria-label="decrease item quantity"
							class={cn("cursor-pointer bg-muted-foreground", quantityTriggerClass)}
						>
							<img src={MinusIcon} alt="minus" />
						</button>
						<span class={cn("pointer-events-none", quantityTriggerClass)}>1</span>
						<button
							aria-label="increase item quantity"
							class={cn("cursor-pointer bg-primary", quantityTriggerClass)}
						>
							<img src={PlusIcon} alt="plus" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
{/snippet}

{#snippet emptyCart()}
	<div
		class="mx-auto g-mt g-mb flex max-w-md flex-col items-center justify-center gap-4 text-center text-muted-foreground"
	>
		<img src={EmptyCartIcon} alt="empty cart" />
		<h6 class="text-2xl font-semibold">Start saving today.</h6>
		<p>
			Let's find you some great stuff. Explore our products and discover your next favorite deal.
		</p>
		<Button onclick={goToShopping} class="mt-2 w-full cursor-pointer">Start Shopping</Button>
	</div>
{/snippet}
