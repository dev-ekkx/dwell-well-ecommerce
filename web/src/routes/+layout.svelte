<script lang="ts">
    import '../app.css';
    import favicon from '$lib/assets/favicon.ico';
    import HeaderComponent from '$lib/components/header.svelte';
    import FooterComponent from '$lib/components/footer.svelte';
    import {page} from '$app/state';
    import {cn} from '$lib/utils';

    let { children, data } = $props();

	const activePage = $derived(page.route.id);
	const isAuthPage = $derived(() => {
		const path = page.url.href.split('/').pop() ?? '';
		return ['login', 'signup'].includes(path);
	});
</script>

<svelte:head>
	<link href={favicon} rel="icon" />

</svelte:head>

<!--Header component-->
{#if !isAuthPage()}
	<HeaderComponent />
{/if}

<!--Main content (pages)-->
<div class={cn('flex flex-col ', {
	'pt-[6.5rem] md:pt-[7rem] xl:pt-[8rem]': (activePage !== '/about') && (!isAuthPage())
} )}>
	{@render children?.()}
</div>

<!--Footer component-->
{#if !isAuthPage()}
	<FooterComponent blok={data.footerCms} footer={data.footer} />
{/if}
