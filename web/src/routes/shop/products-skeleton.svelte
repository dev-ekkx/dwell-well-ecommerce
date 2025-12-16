<section class="flex flex-col gap-5 border md:gap-7 xl:gap-10">
	<!-- Product grid -->
	<div class="grid grid-cols-2 gap-4 gap-y-8 sm:gap-6 md:grid-cols-3 md:gap-y-12 xl:grid-cols-4">
		{#each Array(10) as _}
			<div class="flex flex-col gap-4">
				<!-- Product image -->
				<div class="h-48 w-full animate-pulse rounded-lg bg-gray-300"></div>

				<!-- Title -->
				<div class="h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>

				<!-- Price / metadata -->
				<div class="h-4 w-1/2 animate-pulse rounded bg-gray-300"></div>
			</div>
		{/each}
	</div>

	<!-- Items per page + pagination -->
	<div class="mt-6 flex items-center justify-between gap-4 md:mt-8 xl:mt-10">
		<!-- Items per page skeleton -->
		<div class="flex items-center gap-4">
			<div class="h-4 w-36 animate-pulse rounded bg-gray-300"></div>
			<div class="h-9 w-16 animate-pulse rounded bg-gray-300"></div>
		</div>

		<!-- Pagination skeleton -->
		<div class="flex items-center gap-2">
			<!-- Prev -->
			<div class="h-9 w-9 animate-pulse rounded bg-gray-300"></div>

			<!-- Page numbers -->
			{#each Array(5) as _}
				<div class="h-9 w-9 animate-pulse rounded bg-gray-300"></div>
			{/each}

			<!-- Next -->
			<div class="h-9 w-9 animate-pulse rounded bg-gray-300"></div>
		</div>
	</div>
</section>
