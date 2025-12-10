<footer class="flex flex-col gap-8 bg-muted-foreground g-px g-pt pb-6 font-medium **:text-white">

	<!-- Newsletter + input section -->
	<section class="flex flex-col">
		<div
			class="flex flex-col gap-2 text-center md:text-left lg:flex-row lg:items-center lg:justify-between"
		>
			<div class="flex flex-col gap-4 animate-pulse">
				<div class="h-5 w-40 rounded bg-gray-300/40"></div>
				<div class="h-4 w-72 max-w-lg rounded bg-gray-300/40"></div>
			</div>

			<div class="flex flex-col gap-2 animate-pulse">
				<div class="flex flex-col gap-2 lg:flex-row lg:items-center">
					<div class="h-10 md:w-xs w-full rounded bg-gray-300/40"></div>
					<div class="h-10 w-full md:w-xs lg:w-max rounded bg-gray-300/40"></div>
				</div>
				<div class="h-3 w-56 rounded bg-gray-300/40"></div>
			</div>
		</div>

		<!-- Footer links -->
		<div
			class="mt-8 grid grid-cols-1 gap-8 **:items-center sm:grid-cols-2 md:grid-cols-4 md:**:items-start"
		>
			{#each Array(4) as _}
				<div class="flex flex-col gap-3 animate-pulse">
					<div class="h-4 w-24 rounded bg-gray-300/40"></div>
					<div class="flex flex-col gap-2">
						{#each Array(4) as _}
							<div class="h-3 w-32 rounded bg-gray-300/40 py-2"></div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<hr class="border-white/20" />

	<!-- Copyright + socials -->
	<section class="flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-between">
		<div class="h-4 w-48 rounded bg-gray-300/40"></div>

		<div class="flex items-center gap-4 animate-pulse">
			{#each Array(4) as _}
				<div class="h-5 w-5 rounded bg-gray-300/40"></div>
			{/each}
		</div>
	</section>

</footer>
