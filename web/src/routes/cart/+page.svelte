<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import EmptyCartIcon from "$lib/assets/empty-cart.svg";
	import { goto } from "$app/navigation";
	import { formatNumberWithCommas } from "$lib/utils";
	import { MediaQuery } from "svelte/reactivity";
	import { cartStore } from "$lib/store/cart-store.svelte";
	import CartItem from "./cart-item.svelte";
	import RecentlyViewedProducts from "$lib/components/recently-viewed-products.svelte";
	import TrashIcon from "$lib/assets/trash.svg";

	const mediaQuery = new MediaQuery("max-width: 47.9rem");
	const newMediaQuery = new MediaQuery("min-width: 64rem");
	const isMobile = $derived(mediaQuery.current);
	const isBiggerDevice = $derived(newMediaQuery.current);
	const cartItems = $derived(cartStore.cartItems());
	const totalCartItems = $derived(cartStore.totalItems());
	const isEmpty = $derived(cartStore.cartItems().length === 0);

	const goToShopping = () => {
		goto("/shop");
	};
</script>

<div class="g-mb g-px">
	{#if isEmpty}
		{@render emptyCart()}
	{:else}
		{@render cartData()}
	{/if}

	<RecentlyViewedProducts className="g-mt" />
</div>

{#snippet cartData()}
	<section class="flex flex-col gap-8 lg:flex-row-reverse">
		<!-- Cart summary -->
		<div
			class="flex h-max! w-full flex-col gap-4 rounded-lg border border-b-muted-foreground/20 p-4 shadow-sm shadow-muted-foreground/20 lg:w-sm xl:w-md 2xl:w-xl"
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
			{#if isBiggerDevice}
				{@render checkOutButton()}
			{/if}
		</div>

		<!-- Cart items -->
		<div class="flex flex-1 flex-col gap-4">
			<div class="flex items-center justify-between gap-4">
				<h5 class="text-2xl font-bold">Cart Items ({totalCartItems})</h5>
				<!-- Clear cart button -->
				<Button
					class="text-md flex cursor-pointer items-center gap-2 font-medium text-primary hover:text-primary"
					onclick={() => cartStore.clearCart()}
					variant="ghost"
				>
					<img alt="trash" src={TrashIcon} />
					{#if !isMobile}
						<span>Clear Cart</span>
					{/if}
				</Button>
			</div>
			<!-- Card item -->
			{#each cartItems as item (item.SKU)}
				<CartItem {...item} />
			{/each}
		</div>
		{#if !isBiggerDevice}
			{@render checkOutButton()}
		{/if}
	</section>
{/snippet}

{#snippet checkOutButton()}
	<hr />
	<Button>CheckOut (${formatNumberWithCommas(10_000)})</Button>
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
