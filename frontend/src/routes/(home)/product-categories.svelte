<script lang="ts">

	import ArrowButton from '$lib/components/arrow-button.svelte';
	import LivingRoom from '$lib/assets/images/living-room.jpg';
	import Office from '$lib/assets/images/office.jpg';
	import Bedroom from '$lib/assets/images/bedroom.jpg';
	import Hall from '$lib/assets/images/hall.jpg';
	import Dining from '$lib/assets/images/dining.jpg';

	const handlePrev = () => {
	};
	const handleNext = () => {
	};


	const products = [
		{
			label: 'living room',
			img: LivingRoom
		},
		{
			label: 'office',
			img: Office
		}, {
			label: 'bedroom',
			img: Bedroom
		},
		{
			label: 'hall',
			img: Hall
		},
		{
			label: 'dining',
			img: Dining
		}
	];
</script>


<section class="flex flex-col gap-6 g-mt overflow-x-clip">
	<!--	Category title and arrow buttons -->
	<div class="flex items-center justify-between capitalize gap-4">
		<span class="font-semibold text-2xl leading-8">product categories</span>

		<!-- Arrow buttons -->
		<div class="flex items-center gap-2">
			<ArrowButton direction="left" onclick={handlePrev} />
			<ArrowButton direction="right" onclick={handleNext} />
		</div>
	</div>

	<!--Images and labels-->
	<div class="flex items-center gap-4 lg:gap-6 w-max border-2">
		{#each products as product, idx (product.label)}
			<div class="flex flex-col items-center gap-6">
				<img alt={`Product-${idx}`}
						 class="rounded-xl w-[12.7rem] h-[12.7rem] md:h-[17.9rem] md:w-[17.9rem] lg:w-[22.6rem] lg:h-[22.6rem] object-cover"
						 src={product.img} />
				<span class="capitalize text-lg font-medium">{product.label}</span>
			</div>
		{/each}
	</div>
</section>