<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import EmptyCartIcon from "$lib/assets/empty-cart.svg";

    const isEmpty = true;
</script>

<section class="g-px">

    {#if isEmpty}
        {@render emptyCart()}
    {:else}
        <!-- Cart items and checkout button would go here -->
    {/if}

</section>


{#snippet emptyCart()}
    <div class="flex g-mt g-mb flex-col gap-4 max-w-md text-center mx-auto text-muted-foreground items-center justify-center">
        <img src={EmptyCartIcon} alt="empty cart">
        <h6 class="font-semibold text-2xl">Start saving today.</h6>
        <p>Let's find you some great stuff. Explore our products and discover your next favorite deal.</p>
        <Button class="cursor-pointer w-full mt-2">Start Shopping</Button>
    </div>
    {/snippet}