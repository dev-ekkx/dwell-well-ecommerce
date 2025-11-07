<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import EmptyCartIcon from "$lib/assets/empty-cart.svg";
    import {goto} from "$app/navigation";
    import {formatNumberWithCommas} from "$lib/utils";
    import {MediaQuery} from "svelte/reactivity";
    import CartItem from "./cart-item.svelte";
    import {cartStore} from "$lib/store/cart-store.svelte";

    const mediaQuery = new MediaQuery("max-width: 47.9rem");
    const newMediaQuery = new MediaQuery("min-width: 64rem");
    const isMobile = $derived(mediaQuery.current);
    const isBiggerDevice = $derived(newMediaQuery.current);

    const isEmpty = cartStore.cartItems().length === 0;

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
</div>

{#snippet cartData()}
    <section class="flex flex-col gap-8 lg:flex-row-reverse">
        <!-- Cart summary -->
        <div
                class="flex w-full flex-col gap-4 rounded-lg border border-b-muted-foreground/20 p-4 shadow-sm shadow-muted-foreground/20 h-max! lg:w-sm xl:w-md 2xl:w-xl"
        >
            <h6 class="text-2xl font-semibold capitalize">cart summary</h6>
            <hr/>
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
                <hr/>
                <Button>CheckOut (${formatNumberWithCommas(10_000)})</Button>
            {/if}
        </div>

        <!-- Cart items -->
        <div class="flex flex-1 flex-col gap-4">
            <!-- Card item -->
            {#each cartStore.cartItems() as item (item.SKU)}
                <CartItem {...item}/>
            {/each}
            <CartItem/>
        </div>
        {#if !isBiggerDevice}
            <hr/>
            <Button>CheckOut (${formatNumberWithCommas(10_000)})</Button>
        {/if}
    </section>
{/snippet}

{#snippet emptyCart()}
    <div
            class="mx-auto g-mt g-mb flex max-w-md flex-col items-center justify-center gap-4 text-center text-muted-foreground"
    >
        <img src={EmptyCartIcon} alt="empty cart"/>
        <h6 class="text-2xl font-semibold">Start saving today.</h6>
        <p>
            Let's find you some great stuff. Explore our products and discover your next favorite deal.
        </p>
        <Button onclick={goToShopping} class="mt-2 w-full cursor-pointer">Start Shopping</Button>
    </div>
{/snippet}
