<section class="g-mt g-mb flex flex-col gap-6 overflow-x-clip">

	<!-- Title + arrow buttons -->
	<div class="flex items-center justify-between gap-4 capitalize">

		<!-- Title skeleton -->
		<div
			class="h-8 w-48 rounded bg-gray-300 animate-pulse
				   md:h-10 md:w-60
				   lg:h-12 lg:w-72"
		></div>

		<!-- Arrow buttons skeleton -->
		<div class="flex items-center gap-2">
			<div class="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
			<div class="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
		</div>
	</div>

	<!-- Images + labels -->
	<div class="flex w-max items-center gap-4 lg:gap-6">

		{#each Array(6) as _}
			<div class="flex flex-col items-center gap-6">

				<!-- Image skeleton -->
				<div
					class="rounded-lg bg-gray-300 animate-pulse
						h-[18.75rem] w-[14.75rem]
						lg:h-[35.125rem] lg:w-[26.3rem]"
				></div>

				<!-- Title skeleton -->
				<div class="h-4 w-32 rounded bg-gray-300 animate-pulse"></div>
			</div>
		{/each}

	</div>
</section>
