<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";
	import { cn } from "tailwind-variants";
    
    const mediaQuery = new MediaQuery("max-width: 63.9rem");
	const isMobile = $derived(mediaQuery.current);

    const {
        isDynamicWidth=true
    } : {
        isDynamicWidth?: boolean
    } = $props();

</script>
<section
	class={cn("flex max-w-full flex-col gap-4 overflow-x-clip", {
		"max-w-[67vw] xl:max-w-[71vw]": isDynamicWidth && !isMobile
	})}
>

	<!-- Title + description -->
	<div class="mb-4 flex flex-col gap-4">

		<div class="flex items-center justify-between gap-4">

			<!-- Title -->
			<div
				class="h-8 w-56 rounded bg-gray-300 animate-pulse
					   lg:h-10 lg:w-72"
			></div>

			<!-- View all button -->
			<div class="h-8 w-20 rounded bg-gray-300 animate-pulse"></div>
		</div>

		<!-- Description -->
		<div class="h-4 w-96 max-w-full rounded bg-gray-300 animate-pulse"></div>
	</div>

	<!-- Product carousel -->
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">

		{#each Array(5) as _}
			<div class="flex flex-col gap-4">

				<!-- Product image -->
				<div class="h-64 w-full rounded-lg bg-gray-300 animate-pulse"></div>

				<!-- Product title -->
				<div class="h-4 w-32 rounded bg-gray-300 animate-pulse"></div>
			</div>
		{/each}

	</div>

</section>
