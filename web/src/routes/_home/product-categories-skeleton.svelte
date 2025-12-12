<section class="g-mt flex flex-col gap-6 overflow-x-clip">

	<!-- Category title + arrows -->
	<div class="flex items-center justify-between gap-4 capitalize">

		<!-- Title skeleton -->
		<div class="h-8 w-48 rounded bg-gray-300 animate-pulse 
            md:h-10 md:w-60 lg:h-12 lg:w-72"></div>

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
						h-[12.7rem] w-[12.7rem]
						md:h-[17.9rem] md:w-[17.9rem]
						lg:h-[22.6rem] lg:w-[22.6rem]"
				></div>

				<!-- Label skeleton -->
				<div class="h-4 w-24 rounded bg-gray-300 animate-pulse"></div>
			</div>
		{/each}

	</div>
</section>
