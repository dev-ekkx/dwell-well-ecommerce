<section class="grid grid-cols-4 gap-4">

	{#each Array(4) as _}
		<div class="rounded-lg border border-border p-4 flex flex-col gap-4">

			<!-- Card header / title -->
			<div class="h-5 w-32 rounded bg-gray-300 animate-pulse"></div>

			<!-- Card content / value -->
			<div class="h-8 w-20 rounded bg-gray-300 animate-pulse"></div>

			<!-- Card footer / description -->
			<div class="h-4 w-40 rounded bg-gray-300 animate-pulse"></div>

		</div>
	{/each}

</section>
