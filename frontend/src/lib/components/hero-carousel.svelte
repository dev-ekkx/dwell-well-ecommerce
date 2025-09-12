<script lang="ts">
	import Image1 from '$lib/assets/images/hero-image1.png';
	import Image2 from '$lib/assets/images/hero-image2.png';
	import Image3 from '$lib/assets/images/hero-image3.png';
	import Image4 from '$lib/assets/images/hero-image4.png';
	import ArrowLeftIcon from '$lib/assets/arrow-left.svg';
	import { gsap } from 'gsap';
	import { Flip } from 'gsap/dist/Flip';
	import { onDestroy, onMount } from 'svelte';

	// Register plugin
	gsap.registerPlugin(Flip);

	const images = [
		Image1, Image2, Image3, Image4
	];
	let displayImages = $state([...images]);
	let intervalId: number;

	let currentImage = $state(images[0]);
	let firstImageContainer = $state<HTMLElement | null>(null);
	let secondImageContainer = $state<HTMLElement | null>(null);
	let thirdImageContainer = $state<HTMLElement | null>(null);


	const flipToNextImage = () => {
		displayImages = [
			displayImages[displayImages.length - 1],
			...displayImages.slice(0, displayImages.length - 1)
		];
	};

	const flipToPrevImage = () => {
		displayImages = [
			...displayImages.slice(1),
			displayImages[0]
		];
	};


	onMount(() => {
		intervalId = setInterval(flipToNextImage, 5000);

		return () => {
			clearInterval(intervalId);
		};
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>
<div class="flex flex-col gap-6 w-max">
	<section class="flex gap-4 h-[30.7rem]">

		<!--Current preview image-->
		<div class="h-full aspect-square bg-muted rounded-t-full flex items-center justify-center">
			<img alt="current" class="scale-75" src={displayImages[0]}>
		</div>

		<!--Images list-->
		<div class="flex flex-col justify-between gap-4">

			<!-- First image-->
			<div bind:this={firstImageContainer} class="w-[5.5rem] aspect-square rounded-full overflow-hidden relative">
				<div class="absolute w-full h-1/2 bottom-0 left-0 bg-muted -z-10"></div>
				<img alt="first" class="scale-75" src={displayImages[1]}>
			</div>

			<!--Second image-->
			<div bind:this={secondImageContainer} class="w-[5.5rem] aspect-square rounded-full overflow-hidden relative">
				<div class="absolute w-full h-1/2 bottom-0 left-0 bg-muted -z-10"></div>
				<img alt="second" class="scale-75" src={displayImages[2]}>

			</div>

			<!--Third Image-->
			<div bind:this={thirdImageContainer} class="w-[5.5rem] aspect-square rounded-full overflow-hidden relative">
				<div class="absolute w-full h-1/2 bottom-0 left-0 bg-muted -z-10"></div>
				<img alt="third" class="scale-75" src={displayImages[3]}>
			</div>
		</div>
	</section>

	<!--	Carousel buttons-->
	<div class="flex items-center justify-center gap-4 w-max ml-[30%]">
		<button aria-label="arrow-left"
						class="bg-muted cursor-pointer w-11 aspect-square rounded-full flex items-center justify-center"
						onclick={flipToPrevImage}>
			<img alt="arrow" src={ArrowLeftIcon}>
		</button>
		<button aria-label="arrow-left"
						class="bg-muted cursor-pointer rotate-180 w-11 aspect-square rounded-full flex items-center justify-center"
						onclick={flipToNextImage}>
			<img alt="arrow" src={ArrowLeftIcon}>
		</button>
	</div>
</div>
