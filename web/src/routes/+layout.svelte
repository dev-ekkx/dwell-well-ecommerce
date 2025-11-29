<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.ico";
	import CookieBanner from "$lib/components/cookie-banner.svelte";
	import FooterComponent from "$lib/components/footer.svelte";
	import HeaderComponent from "$lib/components/header.svelte";
	import { AUTH_ROUTES } from "$lib/constants";
	import { cn } from "$lib/utils";
	import "../app.css";

	let { children, data } = $props();
	const activePage = $derived(page.route.id);

	let storedValue: string | null = null;

	if (browser) {
		storedValue = localStorage.getItem("displayCookieBanner");
	}

	const initialVisibility = browser ? storedValue === null || storedValue !== "false" : true;

	let isCookieBannerVisible = $state(initialVisibility);
	$effect(() => {
		const html = document.documentElement;
		if (isCookieBannerVisible) {
			html.classList.add("overflow-hidden");
		}
		html.classList.remove("overflow-hidden");
	});

	$effect(() => {
		localStorage.setItem("displayCookieBanner", String(isCookieBannerVisible));
	});

	const isAuthPage = $derived(AUTH_ROUTES.some((r) => page.url.pathname.endsWith(`/${r}`)));
</script>

<svelte:head>
	<link href={favicon} rel="icon" />
</svelte:head>

{#if isCookieBannerVisible}
	<CookieBanner bind:displayCookieBanner={isCookieBannerVisible} />
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
