<section class="flex flex-col gap-5 md:gap-7 xl:gap-10 border">

	<!-- Product grid -->
	<div
		class="grid grid-cols-2 gap-4 gap-y-8 sm:gap-6 md:grid-cols-3 md:gap-y-12 xl:grid-cols-4"
	>
		{#each Array(10) as _}
			<div class="flex flex-col gap-4">

				<!-- Product image -->
				<div class="h-48 w-full rounded-lg bg-gray-300 animate-pulse"></div>

				<!-- Title -->
				<div class="h-4 w-3/4 rounded bg-gray-300 animate-pulse"></div>

				<!-- Price / metadata -->
				<div class="h-4 w-1/2 rounded bg-gray-300 animate-pulse"></div>
			</div>
		{/each}
	</div>

	<!-- Items per page + pagination -->
	<div class="mt-6 flex items-center justify-between gap-4 md:mt-8 xl:mt-10">

		<!-- Items per page skeleton -->
		<div class="flex items-center gap-4">
			<div class="h-4 w-36 rounded bg-gray-300 animate-pulse"></div>
			<div class="h-9 w-16 rounded bg-gray-300 animate-pulse"></div>
		</div>

		<!-- Pagination skeleton -->
		<div class="flex items-center gap-2">

			<!-- Prev -->
			<div class="h-9 w-9 rounded bg-gray-300 animate-pulse"></div>

			<!-- Page numbers -->
			{#each Array(5) as _}
				<div class="h-9 w-9 rounded bg-gray-300 animate-pulse"></div>
			{/each}

			<!-- Next -->
			<div class="h-9 w-9 rounded bg-gray-300 animate-pulse"></div>
		</div>

	</div>

</section>
