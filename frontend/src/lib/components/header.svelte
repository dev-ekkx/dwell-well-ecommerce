<script lang="ts">
	import { useIsMobileSvelte } from '$lib/hooks/useIsMobile.svelte';
	import { ROUTE_NAVS } from '$lib/constants';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';
	import { page } from '$app/state';
	import SearchIcon from '$lib/assets/search.svg';
	import { Button } from '$lib/components/ui/button';

	const isMobile = useIsMobileSvelte();
	const isActive = (path: string) => page.route.id === path;

</script>
<header class="g-px flex items-center justify-between gap-4 h-[5rem]">
	<!--	Logo-->
	<span class="flex items-center">
		<span class="text-primary font-semibold">Dwell</span>
		<span class="text-muted-foreground">Well</span>
	</span>

	<!--	Navigation-->
	<nav class="h-full flex items-center">
		{#each ROUTE_NAVS as nav (nav.label)}
			<a
				class={cn('border-b-2 px-6 py-3 border-transparent font-semibold text-muted-foreground transition-all duration-200 ease-linear hover:text-primary', {
 'border-primary text-primary': isActive(nav.route)
					})}
				href="{resolve(nav.route)}" aria-label={nav.label}>{nav.label}</a>
		{/each}
	</nav>

	<!--	Search and Login -->
	<div class="flex items-center gap-6 h-full">
		<img alt="search" src={SearchIcon}>
		<Button class="cursor-pointer px-6 h-12">Login</Button>
	</div>
</header>