<div class="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-14">

	<!-- Product summary section -->
	<section class="flex flex-col gap-10 2xl:max-w-[70%]">
		<div class="flex flex-col gap-6">

			<!-- Title -->
			<div class="h-10 w-64 rounded bg-gray-300 animate-pulse md:h-12 md:w-80 lg:h-16 lg:w-96"></div>

			<!-- Subtitle -->
			<div class="h-3 w-80 rounded bg-gray-300 animate-pulse"></div>
			<div class="h-3 w-60 -mt-5 rounded bg-gray-300 animate-pulse"></div>
			<div class="h-3 w-40 -mt-5 rounded bg-gray-300 animate-pulse"></div>
			<div class="h-3 w-[18rem] -mt-5 rounded bg-gray-300 animate-pulse"></div>
			<div class="h-3 w-[22rem] -mt-5 rounded bg-gray-300 animate-pulse"></div>
		</div>

		<!-- CTA buttons -->
		<div class="flex flex-col gap-2 sm:flex-row sm:gap-5 md:gap-6">
			{#each Array(2) as _}
				<div class="h-11 w-36 rounded bg-gray-300 animate-pulse"></div>
			{/each}
		</div>
	</section>

	<!-- Carousel skeleton -->
	<section
		class="flex gap-3 overflow-hidden pb-16 md:max-h-[29rem] md:gap-10 md:px-14 lg:max-h-[35rem] lg:gap-6 lg:px-0 lg:pt-6"
	>
		<!-- Current preview image -->
		<div
			class="relative p-4 sm:p-6 md:p-8 lg:p-10 flex h-full w-full items-center justify-center rounded-t-full bg-muted"
			id="preview-container"
		>
			<!-- Main image skeleton -->
			<div class="h-60 w-60 md:h-72 md:w-72 lg:h-80 lg:w-80 rounded-full bg-gray-300 animate-pulse"></div>

			<!-- Carousel buttons -->
			<div class="absolute -bottom-16 flex items-center justify-center gap-4">
				<div class="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
				<div class="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
			</div>
		</div>

		<!-- Thumbnail list -->
		<div class="flex flex-col justify-between gap-4">

			{#each Array(3) as _}
				<div class="relative h-[3rem] w-[3rem] rounded-full">
					<div class="absolute bottom-0 left-0 -z-10 h-1/2 w-full rounded-b-full bg-muted"></div>

					<!-- Thumbnail skeleton -->
					<div class="h-full w-full rounded-full bg-gray-300 animate-pulse"></div>
				</div>
			{/each}

		</div>
	</section>

</div>
