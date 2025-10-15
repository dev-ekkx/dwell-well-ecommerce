<script lang="ts">
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
	import { useIsMobile } from '$lib/hooks/useIsMobile.svelte';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';


	const isActiveRoute = (path: string) => page.route.id === path;
	const isMobile = useIsMobile();
	let searchTerm = $state('');
	let isMenuOpen = $state(false);
	let isSearchOpen = $state(false);
	let menu = $state<HTMLElement | null>(null);
	let searchMenu = $state<HTMLElement | null>(null);
	let menuButton = $state<HTMLElement | null>(null);
	let searchButton = $state<HTMLElement | null>(null);

	const getSearchValue = (e: Event) => {
		const target = e.target as HTMLInputElement;
		searchTerm = target.value;

		if (e instanceof KeyboardEvent && e.key === 'Enter' && searchTerm) {
			e.preventDefault();
			goto(resolve(`/shop?q=${encodeURIComponent(searchTerm)}`));
			if (isSearchOpen) {
				toggleSearch();
			}
		}
	};

	async function toggleMenu() {
		if (isMenuOpen && menu) {
			// Start animate out
			await gsap.to(menu, {
				y: '-150%',
				duration: 0.4,
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

	async function toggleSearch() {
		if (isSearchOpen && searchMenu) {
			// Start animate out
			await gsap.to(searchMenu, {
				y: '-200%',
				duration: 0.4,
				ease: 'power1.out',
				onComplete: () => {
					isSearchOpen = false;
				}
			});
		} else {
			isSearchOpen = true;
			await tick();
			if (searchMenu) {
				// Animate in
				gsap.fromTo(
					searchMenu,
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
				menuButton &&
				!menu.contains(event.target as Node) &&
				!menuButton.contains(event.target as Node)
			) {
				toggleMenu();
			}

			if (
				isSearchOpen &&
				searchMenu &&
				searchButton &&
				!searchMenu.contains(event.target as Node) &&
				!searchButton.contains(event.target as Node)
			) {
				toggleSearch();
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

	const loginAndResetDropdown = () => {
		if (isMenuOpen) {
			toggleMenu();
		}
		if (isSearchOpen) {
			toggleSearch();
		}
		goto(resolve('/login'));
	};

</script>


<!-- Header component-->
<header
	class="g-px flex items-center justify-between gap-4 h-[8vh] fixed top-0 z-50 left-0 w-full border-b bg-white">
	<!--	Logo-->
	<LogoComponent />

	<!--		Desktop navigation-->
	{#if !isMobile()}
		{@render desktopNav()}
	{/if}

	<!--	Search and Login buttons -->
	<div class="flex items-center gap-6">
		<button aria-label="search" bind:this={searchButton} class="cursor-pointer" onclick={toggleSearch}>
			<img alt="search" src={SearchIcon}>
		</button>

		{#if isMobile()}
			<button bind:this={menuButton} onclick={toggleMenu} aria-label="hamburger toggle"
							class="w-8 justify-center cursor-pointer **:pointer-events-none">
				{#if isMenuOpen}
					<img src={CloseIcon} alt="close">
				{:else}
					<img src={HamburgerIcon} alt="hamburger">
				{/if}
			</button>
		{:else}
			<Button onclick={loginAndResetDropdown} class="hidden lg:inline-flex cursor-pointer px-6 h-full">Login</Button>
		{/if}
	</div>
</header>

<!--Search menu-->
{#if isSearchOpen}
	<div bind:this={searchMenu} class="fixed w-full g-px py-2 backdrop-blur-xs z-20 top-[8vh] ">
		<div class="flex">
			<img alt="search" class="-mr-8 z-20" src={SearchIcon}>
			<Input onkeydown={getSearchValue} bind:value={searchTerm}
						 autofocus
						 class="pl-10 placeholder:text-muted-foreground max-w-full" placeholder="Search..."
						 type="search" />
		</div>
	</div>
{/if}

<!--Mobile Menu component-->
{#if isMenuOpen}
	<section bind:this={menu} class="h-max fixed z-20 top-[8vh] left-0 w-full bg-white g-px pb-4 shadow-md">
		<div class="flex flex-col gap-8 pt-6">
			{@render navigation(true)}
			<a
				onclick="{isMenuOpen ? toggleMenu : null}"
				href="/login"
				class="w-full py-2 rounded-lg flex items-center justify-center text-white bg-primary hover:opacity-80 transition-all duration-200 ease-linear">login</a>
		</div>
	</section>
{/if}

<!-- Desktop	Navigation-->
{#snippet desktopNav()}
	<nav class="h-12 hidden lg:flex items-center">
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