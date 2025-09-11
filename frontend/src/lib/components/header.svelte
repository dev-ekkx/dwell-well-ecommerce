<script lang="ts">
	import { useIsMobileSvelte } from '$lib/hooks/useIsMobile.svelte';
	import { ROUTE_NAVS } from '$lib/constants';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';
	import { page } from '$app/state';
	import SearchIcon from '$lib/assets/search.svg';
	import { Button } from '$lib/components/ui/button';
	import LogoComponent from '$lib/components/logo.svelte';
	import HamburgerIcon from '$lib/assets/menu.svg';
	import CloseIcon from '$lib/assets/close.svg';

	const isMobile = useIsMobileSvelte();
	let isMenuOpen = $state(false);
	const isActive = (path: string) => page.route.id === path;

	$effect(() => {
		if (!isMobile()) {
			isMenuOpen = false;
		}
	});
</script>


<!-- Header component-->
<header class="g-px flex items-center justify-between gap-4 h-[8vh] fixed top-0 z-50 w-full border-b">
	<!--	Logo-->
	<LogoComponent />

	<!--	Desktop navigation-->
	{#if !isMobile()}
		{@render desktopNav()}
	{/if}

	<!--	Search and Login -->
	<div class="flex items-center gap-6">
		<img alt="search" src={SearchIcon}>
		{#if isMobile()}
			<div class="">
				<button onclick={() => isMenuOpen = !isMenuOpen} aria-label="hamburger toggle"
								class="w-8 flex justify-center cursor-pointer">
					{#if isMenuOpen}
						<img src={CloseIcon} alt="close">
					{:else}
						<img src={HamburgerIcon} alt="hamburger">
					{/if}
				</button>
			</div>
		{:else}
			<Button class="cursor-pointer px-6 h-full">Login</Button>
		{/if}
	</div>
</header>


<!--Mobile Menu component-->
<!--{#snippet mobileMenu()}-->
<section class="h-[92vh] border-t z-50 absolute bottom-0 w-full bg-white g-px">
	<div class="flex flex-col gap-8 **:w-2/12 pt-6">
		{@render navigation(true)}

		<Button class="cursor-pointer px-6 h-full !w-full">Login</Button>
	</div>
</section>
<!--{/snippet}-->

<!-- Desktop	Navigation-->
{#snippet desktopNav()}
	<nav class="h-12 flex items-center">
		{@render navigation()}
	</nav>
{/snippet}

<!--Routes -->
{#snippet navigation(isMobile = false)}
	{#each ROUTE_NAVS as nav (nav.label)}
		<a
			onclick="{() => isMenuOpen = false}"
			class={cn('border-b-2 h-full flex items-center px-6 border-transparent font-semibold text-muted-foreground transition-all duration-200 ease-linear hover:text-primary', {
 'border-primary text-primary': isActive(nav.route),
 'px-0': isMobile,
					})}
			href="{resolve(nav.route)}" aria-label={nav.label}>{nav.label}</a>
	{/each}
{/snippet}