<script lang="ts">

	import ArrowButton from '$lib/components/arrow-button.svelte';

	const handlePrev = () => {
	};
	const handleNext = () => {
	};
</script>


<section class="flex flex-col gap-6">
	<!--	Category title and arrow buttons -->
	<div class="flex items-center justify-between capitalize gap-4">
		<span class="font-semibold text-2xl leading-8">product categories</span>

		<!-- Arrow buttons -->
		<div class="flex items-center gap-2">
			<ArrowButton direction="left" onclick={handlePrev} />
			<ArrowButton direction="right" onclick={handleNext} />
		</div>
	</div>

	
</section>