<script lang="ts">
	import { Content, List, Root, Trigger } from '$lib/components/ui/tabs/index';
	import Product1 from '$lib/assets/images/category1.jpg';
	import Product2 from '$lib/assets/images/category2.jpg';
	import Product3 from '$lib/assets/images/category3.jpg';
	import Product4 from '$lib/assets/images/category4.jpg';
	import Product5 from '$lib/assets/images/category5.jpg';
	import Product6 from '$lib/assets/images/category6.jpg';
	import Product7 from '$lib/assets/images/category7.jpg';
	import Product8 from '$lib/assets/images/category8.jpg';
	import Product9 from '$lib/assets/images/category9.jpg';
	import Product10 from '$lib/assets/images/category10.jpg';
	import Product11 from '$lib/assets/images/category11.jpg';
	import Product12 from '$lib/assets/images/category12.jpg';
	import Product13 from '$lib/assets/images/category13.jpg';
	import Product14 from '$lib/assets/images/category14.jpg';
	import Product15 from '$lib/assets/images/category15.jpg';
	import Product16 from '$lib/assets/images/category16.jpg';
	import Product17 from '$lib/assets/images/category17.jpg';
	import Product18 from '$lib/assets/images/category18.jpg';
	import Product19 from '$lib/assets/images/category19.jpg';
	import Product20 from '$lib/assets/images/category20.jpg';

	const showrooms = [
		{
			continent: 'africa',
			countries: [
				{ name: 'Ghana', image: Product1 },
				{ name: 'Nigeria', image: Product2 },
				{ name: 'Kenya', image: Product3 },
				{ name: 'South Africa', image: Product4 },
				{ name: 'Egypt', image: Product5 },
				{ name: 'Morocco', image: Product6 }
			]
		},
		{
			continent: 'europe',
			countries: [
				{ name: 'France', image: Product7 },
				{ name: 'Germany', image: Product8 },
				{ name: 'Italy', image: Product9 },
				{ name: 'Spain', image: Product10 },
				{ name: 'Netherlands', image: Product11 },
				{ name: 'Sweden', image: Product12 }
			]
		},
		{
			continent: 'north america',
			countries: [
				{ name: 'USA', image: Product13 },
				{ name: 'Canada', image: Product14 },
				{ name: 'Mexico', image: Product15 },
				{ name: 'Cuba', image: Product16 },
				{ name: 'Dominican Republic', image: Product17 }
			]
		},
		{
			continent: 'south america',
			countries: [
				{ name: 'Brazil', image: Product18 },
				{ name: 'Argentina', image: Product19 },
				{ name: 'Chile', image: Product20 },
				{ name: 'Colombia', image: Product1 },
				{ name: 'Peru', image: Product2 }
			]
		}
	];

</script>

<section class="g-px g-mt-pt flex flex-col gap-6">
	<h4 class="text-center text-section-head">visit our showrooms</h4>
	<p class="text-section-p text-center">Experience the AmaliHomes difference firsthand at one of our global showrooms.
		Discover
		premium furniture, expert
		design advice, and stylish inspirations to transform your space. Step in today</p>

	<!--Showrooms	tabs -->
	<Root class="w-full mt-4" value={showrooms[0].continent}>
		<!--		Showroom (tab) lists and triggers-->
		<List class="flex w-full max-w-2xl overflow-x-auto px-4 gap-4 justify-baseline h-max scrollbar-hidden">
			{#each showrooms as showroom (showroom.continent)}
				<Trigger
					value={showroom.continent}
					class="capitalize"
				>
					{showroom.continent}
				</Trigger>
			{/each}
		</List>

		<!--		Showroom (tab) content-->
		{#each showrooms as showroom (showroom.continent)}
			<Content value={showroom.continent} class="p-4">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{#each showroom.countries as country (country.name)}
						<div class="rounded-lg h-[21.75rem] relative overflow-clip">
							<img
								src={country.image}
								alt={country.name}
								class="w-full h-full object-cover"
							/>
							<div
								class="absolute flex flex-col font-semibold text-white justify-end px-4 py-3 gap-1 bg-gradient-to-b from-transparent to-black/90 bottom-0 left-0 w-full h-3/12">
								{country.name}
							</div>
						</div>
					{/each}
				</div>
			</Content>
		{/each}
	</Root>
</section>