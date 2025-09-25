<script lang="ts">
	import MedalIcon from '$lib/assets/medal.svg';
	import ShieldIcon from '$lib/assets/shield.svg';
	import AwardIcon from '$lib/assets/award.svg';
	import RecycleIcon from '$lib/assets/recycle.svg';
	import ProductImage from '$lib/assets/images/category1.webp';

	const achievements = [
		{
			icon: MedalIcon,
			title: 'Award winning designs',
			description: 'Experience innovative and stylish furniture, recognized for excellence.'
		},
		{
			icon: ShieldIcon,
			title: '10-year warranty',
			description: 'Enjoy peace of mind with our durable furniture, backed by a 10-year warranty.'
		},
		{
			icon: AwardIcon,
			title: 'Quality furniture',
			description: 'Designed for comfort and durability, our furniture is superior  above all'
		},
		{
			icon: RecycleIcon,
			title: 'Sustainable materials',
			description: 'Eco-friendly furniture made with responsibly sourced, high-quality materials'
		}
	];
</script>

<section class="g-mt-pt flex-col gap-6 g-px grid grid-cols-10 ">
	<div class="flex flex-col gap-8 col-span-10 lg:col-span-6">
		<div class="flex flex-col gap-6">
			<h4 class="text-section-head">what we're known for</h4>
			<p>For over three decades, DwellWell has been dedicated to building dream homes that surpass expectations in
				quality,
				design, and sustainability.</p>
		</div>

		<div class="grid grid-cols-1 gap-10 md:gap-6 md:grid-cols-2">
			{#each achievements as achievement (achievement.title)}
				<div class="flex flex-col gap-6 md:gap-4">
					<div class="h-16 w-16 rounded-lg bg-primary-foreground flex items-center justify-center">
						<img src={achievement.icon} alt={achievement.title} />
					</div>
					<span class="font-semibold text-md">{achievement.title}</span>
					<p>{achievement.description}</p>
				</div>
			{/each}
		</div>
	</div>
	<img alt="wardrobe"
			 class="transition-all duration-500 ease-linear col-span-10 w-full max-h-[20rem] lg:col-span-4 md:max-h-[35rem] lg:max-h-auto rounded-lg object-cover"
			 src={ProductImage}>
</section>