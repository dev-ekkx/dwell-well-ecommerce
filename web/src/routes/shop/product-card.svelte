<script lang="ts">
	import { formatNumberWithCommas } from '$lib/utils';
	import { type ConfigI, StarRating } from '@dev-ekkx/svelte-star-rating';
	import CartIcon from '$lib/assets/cart.svg';
	import { MediaQuery } from 'svelte/reactivity';
	import type { ProductCardI } from '$lib/interfaces';

	const product: ProductCardI = $props();

	const mediaQuery = new MediaQuery('max-width: 63.9rem');
	const baseCmsUrl = import.meta.env.VITE_CMS_URL;
	const isMobile = $derived(mediaQuery.current);
	const productImage = $derived(`${baseCmsUrl}${product.images[0].url}`);
	
	const config = $derived<ConfigI>({
		readonly: true,
		maxVal: 5,
		minVal: 0,
		step: 0.1,
		numOfStars: 5,
		starConfig: {
			size: isMobile ? 11 : 14,
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
		<img alt={product.name}
				 class="object-cover group-hover:scale-110 w-full h-full transition-all duration-200 ease-linear"
				 src={productImage}>
	</div>

	<div class="flex flex-col gap-1">
		<span class="font-semibold text-xl leading-7">{product.name}</span>
		<span class="flex items-center gap-1">
			<StarRating bind:value {config} />
	<span class="text-muted-foreground text-sm">4.8 (120 Reviews)</span>
		</span>
		<span class="flex items-center gap-1 font-bold text-xl leading-7">
			<span class="text-muted-foreground line-through">${formatNumberWithCommas(400)}</span>
			<span class="">${formatNumberWithCommas(299)} </span>
		</span>
	</div>

</div>