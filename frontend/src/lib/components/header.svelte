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
	import { gsap } from 'gsap';
	import { onMount, tick } from 'svelte';

	const isActiveRoute = (path: string) => page.route.id === path;
	const isMobile = useIsMobileSvelte();
	let isMenuOpen = $state(false);
	let showSearchInput = $state(false);
	let menu = $state<HTMLElement | null>(null);
	let toggleButton = $state<HTMLElement | null>(null);
	let searchButton = $state<HTMLElement | null>(null);

	async function toggleMenu() {
		if (isMenuOpen && menu) {
			// Start animate out
			await gsap.to(menu, {
				y: '-100%',
				duration: 0.3,
				ease: 'power1.out',
				onComplete: () => {
					isMenuOpen = false;
				}
			});
		} else {
			isMenuOpen = true;
			await tick();
			if (menu) {
				// Animate in
				gsap.fromTo(
					menu,
					{ y: '-100%' },
					{ y: 0, duration: 0.3, ease: 'power1.out' }
				);
			}
		}
	}

	$effect(() => {
		if (!isMobile()) {
			isMenuOpen = false;
		}
	});

	onMount(() => {
		// Handle click outside to close menu
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isMenuOpen &&
				menu &&
				toggleButton &&
				!menu.contains(event.target as Node) &&
				!toggleButton.contains(event.target as Node)
			) {
				toggleMenu();
			}
		};
		document.addEventListener('click', handleClickOutside);

		return () => {
			// Cleanup
			document.removeEventListener('click', handleClickOutside);
			if (menu) {
				gsap.killTweensOf(menu);
			}
		};
	});

</script>


<!-- Header component-->
<header class="g-px flex items-center justify-between gap-4 h-[8vh] fixed top-0 z-50 w-full border-b bg-white">
	<!--	Logo-->
	<LogoComponent />

	<!--	Desktop navigation-->
	{#if !isMobile()}
		{@render desktopNav()}
	{/if}

	<!--	Search and Login -->
	<div class="flex items-center gap-6">
		<button aria-label="search" bind:this={searchButton} class="cursor-pointer">
			<img alt="search" src={SearchIcon}>
		</button>
		{#if isMobile()}
			<button bind:this={toggleButton} onclick={toggleMenu} aria-label="hamburger toggle"
							class="w-8 flex justify-center cursor-pointer **:pointer-events-none">
				{#if isMenuOpen}
					<img src={CloseIcon} alt="close">
				{:else}
					<img src={HamburgerIcon} alt="hamburger">
				{/if}
			</button>
		{:else}
			<Button class="cursor-pointer px-6 h-full">Login</Button>
		{/if}
	</div>
</header>

<!--Search menu-->
<!--<div class="relative w-full max-w-lg">-->
<!--	<img alt="search" class="absolute top-1/2 left-1 -translate-y-1/2" src={SearchIcon}>-->
<!--	<Input class="pl-10 placeholder:text-muted-foreground border-muted-foreground"-->
<!--				 placeholder="Search..." />-->
<!--</div>-->

<!--Mobile Menu component-->
{#if isMenuOpen}
	<section bind:this={menu} class="h-max z-[40] absolute top-20 w-full bg-white g-px pb-4 shadow-md">
		<div class="flex flex-col gap-8 pt-6 **:w-2/12">
			{@render navigation(true)}
			<Button
				class="cursor-pointer px-6 h-full !w-full">Login
			</Button>
		</div>
	</section>
{/if}

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
			onclick="{isMenuOpen ? toggleMenu : null}"
			class={cn('border-b-2 h-full flex items-center px-6 border-transparent font-semibold text-muted-foreground transition-all duration-200 ease-linear hover:text-primary', {
 'border-primary text-primary': isActiveRoute(nav.route),
 'px-0': isMobile,
					})}
			href="{resolve(nav.route)}" aria-label={nav.label}>{nav.label}</a>
	{/each}
{/snippet}