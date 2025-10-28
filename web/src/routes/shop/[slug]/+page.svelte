<script lang="ts">
    import type {PageProps} from './$types';
    import {Item, Link, List, Page, Root, Separator} from "$lib/components/ui/breadcrumb/index.js";

    let { data }: PageProps = $props();
const product = $derived(data.product)

    $inspect(product)
</script>

<div class="flex flex-col gap-4 g-px">
    <Root>
        <List>
            <Item>
                <Link href="/shop">Shop</Link>
            </Item>
            <Separator />
            <Item>
                <Page>Hello </Page>
            </Item>
        </List>
    </Root>

    <section class="g-py">
<!-- images -->
<div class="flex flex-col gap-6 md:flex-row md:gap-10 xl:gap-8">
    <img alt={product.images[0].alternativeText} class="h-[22.5rem] rounded-lg aspect-square object-cover" src={product.images[0].url}>
</div>
    </section>
</div>