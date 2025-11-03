<script lang="ts">
    import {resolve} from "$app/paths";
    import {cn, setRouteParams} from "$lib/utils";
    import {page} from "$app/state";
    import SearchIcon from "$lib/assets/search.svg";
    import {Button} from "$lib/components/ui/button";
    import LogoComponent from "$lib/components/logo.svelte";
    import HamburgerIcon from "$lib/assets/menu.svg";
    import CloseIcon from "$lib/assets/close.svg";
    import {gsap} from "gsap";
    import {onMount, tick} from "svelte";
    import {goto} from "$app/navigation";
    import {Input} from "$lib/components/ui/input";
    import {MediaQuery} from "svelte/reactivity";
    import {ROUTE_NAVS} from "$lib/constants";

    const mediaQuery = new MediaQuery("max-width: 63.9rem");
	const isMobile = $derived(mediaQuery.current);
	const isActiveRoute = (path: string) => {
		if (path === "/") {
			return page.route.id === "/";
		}
		return (page.route?.id ?? "").includes(path);
	};
	let isMenuOpen = $state(false);
	let showMenuOverlay = $state(false);
	let isSearchOpen = $state(false);
	let menu = $state<HTMLElement | null>(null);
	let searchMenu = $state<HTMLElement | null>(null);
	let menuButton = $state<HTMLElement | null>(null);
	let searchButton = $state<HTMLElement | null>(null);
	let searchInput = $state<HTMLInputElement | null>(null);
	let searchTerm = $state("");

    $effect(() => {
        if (isSearchOpen && searchInput) {
            searchInput.focus({preventScroll: true});
        }
    })

	async function toggleMenu() {
		showMenuOverlay = !showMenuOverlay;
		if (isMenuOpen && menu) {
			// Start animate out
			await gsap.to(menu, {
				y: "-150%",
				duration: 0.4,
				ease: "power1.out",
				onComplete: () => {
					isMenuOpen = false;
				}
			});
		} else {
			isMenuOpen = true;
			await tick();
			if (menu) {
				// Animate in
				gsap.fromTo(menu, { y: "-100%" }, { y: 0, duration: 0.3, ease: "power1.out" });
			}
		}
	}

	async function toggleSearch() {
		if (isSearchOpen && searchMenu) {
			// Start animate out
			await gsap.to(searchMenu, {
				y: "-200%",
				duration: 0.4,
				ease: "power1.out",
				onComplete: () => {
					isSearchOpen = false;
				}
			});
		} else {
			isSearchOpen = true;
			await tick();
			if (searchMenu) {
				// Animate in
				gsap.fromTo(searchMenu, { y: "-100%" }, { y: 0, duration: 0.3, ease: "power1.out" });
			}
		}
	}

	const getSearchValue = async (e: Event) => {
		if (e instanceof KeyboardEvent && e.key === "Enter") {
			e.preventDefault();

           await handleSearch()
		}
	};

    const handleSearch = async () => {
        if (!searchTerm) {
            return;
        }
        await setRouteParams({ q: searchTerm }, false, "/shop");
        if (isSearchOpen) {
            await toggleSearch();
        }
    }

	const handleInput = async () => {
		if (page.url.pathname === "/shop" && !searchTerm.length) {
			await setRouteParams({ q: "" });
		}
	};

	$effect(() => {
		if (!isMobile) {
			isMenuOpen = false;
		}
	});

	onMount(() => {
		// Set search term on page mount
		searchTerm = page.url.searchParams.get("q") ?? "";

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
		document.addEventListener("click", handleClickOutside);

		return () => {
			// Cleanup
			document.removeEventListener("click", handleClickOutside);
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
		goto(resolve("/login"));
	};
</script>

<!-- Header component-->
<header
	class="fixed top-0 left-0 z-50 flex h-[8vh] w-full items-center justify-between gap-4 border-b bg-white g-px"
>
	<!--	Logo-->
	<LogoComponent />

	<!--		Desktop navigation-->
	{#if !isMobile}
		{@render desktopNav()}
	{/if}

	<!--	Search and Login buttons -->
	<div class="flex items-center gap-6">
		<button
			aria-label="search"
			bind:this={searchButton}
			class="cursor-pointer"
			onclick={toggleSearch}
		>
			<img alt="search" src={SearchIcon} />
		</button>

		{#if isMobile}
			<button
				bind:this={menuButton}
				onclick={toggleMenu}
				aria-label="hamburger toggle"
				class="w-8 cursor-pointer justify-center **:pointer-events-none"
			>
				{#if isMenuOpen}
					<img src={CloseIcon} alt="close" />
				{:else}
					<img src={HamburgerIcon} alt="hamburger" />
				{/if}
			</button>
		{:else}
			<Button
				onclick={loginAndResetDropdown}
				class="hidden h-full cursor-pointer px-6 lg:inline-flex"
				>Login
			</Button>
		{/if}
	</div>
</header>

<!--Search menu-->
{#if isSearchOpen}
	<div bind:this={searchMenu} class="fixed top-[8vh] z-20 w-full g-px py-2 backdrop-blur-xs">
		<div class="flex">
			<img alt="search" class="z-20 -mr-8" src={SearchIcon} />
			<Input
                    bind:ref={searchInput}
				onkeydown={getSearchValue}
				bind:value={searchTerm}
				oninput={handleInput}
				id="searchTerm"
				class="max-w-full pl-10 placeholder:text-muted-foreground"
				placeholder="Search..."
				type="search"
			/>
            {#if searchTerm.length > 0}
            <Button onclick={handleSearch} class="ml-2 cursor-pointer">Search</Button>
                {/if}
		</div>
	</div>
{/if}

<!--Mobile Menu component-->
{#if showMenuOverlay}
	<div class="fixed top-0 z-20 h-screen w-screen bg-black/60 backdrop-blur-xs"></div>
{/if}
{#if isMenuOpen}
	<section
		bind:this={menu}
		class="fixed top-[8vh] left-0 z-20 h-max w-full bg-white g-px pb-4 shadow-md"
	>
		<div class="flex flex-col gap-8 pt-6">
			{@render navigation(true)}
			<a
				onclick={isMenuOpen ? toggleMenu : null}
				href="/login"
				class="flex w-full items-center justify-center rounded-lg bg-primary py-2 text-white transition-all duration-200 ease-linear hover:opacity-80"
				>login</a
			>
		</div>
	</section>
{/if}

<!-- Desktop	Navigation-->
{#snippet desktopNav()}
	<nav class="hidden h-12 items-center lg:flex">
		{@render navigation()}
	</nav>
{/snippet}

<!--Routes -->
{#snippet navigation(isMobile = false)}
	{#each ROUTE_NAVS as nav (nav.label)}
		<a
			onclick={isMenuOpen ? toggleMenu : null}
			class={cn(
				"flex h-full items-center border-b-2 border-transparent px-6 font-semibold text-muted-foreground transition-all duration-200 ease-linear hover:text-primary",
				{
					"border-primary text-primary": isActiveRoute(nav.route),
					"px-0": isMobile
				}
			)}
			href={resolve(nav.route)}
			aria-label={nav.label}>{nav.label}</a
		>
	{/each}
{/snippet}
