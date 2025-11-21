<script lang="ts">
    import "../app.css";
    import favicon from "$lib/assets/favicon.ico";
    import HeaderComponent from "$lib/components/header.svelte";
    import FooterComponent from "$lib/components/footer.svelte";
    import {page} from "$app/state";
    import {cn} from "$lib/utils";
    import {AUTH_ROUTES} from "$lib/constants";
    import CookieBanner from "$lib/components/cookie-banner.svelte";

    let { children, data } = $props();
	const activePage = $derived(page.route.id);

	let isCookieBannerVisible = $state(true);

	$effect(() => {
		if (isCookieBannerVisible) {
			const html = document.documentElement;
			html.classList.add("overflow-hidden");
		}
	});

	const isAuthPage = $derived(AUTH_ROUTES.some((r) => page.url.pathname.endsWith(`/${r}`)));
</script>

<svelte:head>
	<link href={favicon} rel="icon" />
</svelte:head>

{#if isCookieBannerVisible}
	<CookieBanner />
{/if}

<!--Header component-->
{#if !isAuthPage}
	<HeaderComponent />
{/if}

<!--Main content (pages)-->
<div
	class={cn("flex flex-col ", {
		"pt-[6.5rem] md:pt-[7rem] xl:pt-[8rem]": activePage !== "/about" && !isAuthPage
	})}
>
	{@render children?.()}
</div>

<!--Footer component-->
{#if !isAuthPage}
	<FooterComponent footer={data.footer} />
{/if}
