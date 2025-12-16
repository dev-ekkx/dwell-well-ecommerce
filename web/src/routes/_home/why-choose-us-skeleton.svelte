<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";

	const mediaQuery = new MediaQuery("max-width: 63.9rem");
	const isMobile = $derived(mediaQuery.current);
</script>

<div class="g-mt flex flex-col gap-12 lg:flex-row lg:justify-between">
	<section class="flex flex-col gap-10">
		<!-- Title + description -->
		<div class="flex flex-col gap-4">
			<!-- Title -->
			<div class="h-7 w-56 animate-pulse rounded bg-gray-300"></div>

			<!-- Description lines -->
			<div class="h-4 w-80 max-w-[35rem] animate-pulse rounded bg-gray-300"></div>
			<div class="h-4 w-64 max-w-[35rem] animate-pulse rounded bg-gray-300"></div>
		</div>

		<!-- Reasons grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each Array(4) as _}
				<div class="flex flex-col gap-3 lg:gap-4">
					<!-- Icon -->
					<div
						class="flex h-14 w-14 animate-pulse items-center justify-center rounded-lg bg-gray-300"
					></div>

					<!-- Subtitle -->
					<div class="h-5 w-40 animate-pulse rounded bg-gray-300"></div>

					<!-- Description lines -->
					<div class="h-4 w-56 animate-pulse rounded bg-gray-300"></div>
					<div class="h-4 w-48 animate-pulse rounded bg-gray-300"></div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Right-side image (desktop only) -->
	{#if !isMobile}
		<div class="h-[38rem] w-[40vw] animate-pulse rounded-2xl bg-gray-300"></div>
	{/if}
</div>
