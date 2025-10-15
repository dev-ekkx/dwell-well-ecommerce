<script lang="ts">
	import ProductImage from '$lib/assets/images/auth-bg.webp';
	import { formatNumberWithCommas } from '$lib/utils';
	import { type ConfigI, StarRating } from '@dev-ekkx/svelte-star-rating';
	import CartIcon from '$lib/assets/cart.svg';

	const config = $state<ConfigI>({
		readonly: true,
		maxVal: 5,
		minVal: 0,
		step: 0.1,
		numOfStars: 5,
		starConfig: {
			size: 12,
			filledColor: '#F98416',
			unfilledColor: '#5D5D5D'
		},
		styles: {
			containerStyles: 'width: max-content',
			starStyles: 'gap: 0.1rem'
		}
	});

	let value = $state(4.8);


</script>

<div class="flex flex-col gap-4 relative group">
	<!--	add to cart button-->
	<button
		class="absolute cursor-pointer z-10 top-4 right-2 rounded-full bg-primary h-8 w-8 flex items-center justify-center">
		<img alt="cart" class="scale-75" src={CartIcon} />
	</button>

	<div class="h-[11rem] md:h-[12rem] rounded-lg overflow-clip">
		<img alt=""
				 class="object-cover group-hover:scale-110 w-full h-full transition-all duration-200 ease-linear"
				 src={ProductImage}>
	</div>

	<div class="flex flex-col gap-2">
		<span class="font-semibold text-xl leading-7">Product name</span>
		<span class="flex items-center gap-1">
			<StarRating bind:value {config} />
	<span class="text-muted-foreground">4.8 (120 Reviews)</span>
		</span>
		<span class="flex items-center gap-1 font-bold text-xl leading-7">
			<span class="text-muted-foreground line-through">${formatNumberWithCommas(400)}</span>
			<span class="">${formatNumberWithCommas(299)} </span>
		</span>
	</div>

</div>