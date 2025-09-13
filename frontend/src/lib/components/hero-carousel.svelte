<script lang="ts">
	import Image1 from '$lib/assets/images/hero-image5.png';
	import Image2 from '$lib/assets/images/hero-image2.png';
	import Image3 from '$lib/assets/images/hero-image3.png';
	import Image4 from '$lib/assets/images/hero-image4.png';
	import { gsap } from 'gsap';
	import { Flip } from 'gsap/dist/Flip';
	import { onDestroy, onMount } from 'svelte';
	import ArrowLeftIcon from '$lib/assets/arrow-left.svg';

	// Register plugin
	gsap.registerPlugin(Flip);

	const images = [Image1, Image2, Image3, Image4];
	let displayImages = $state([...images]);
	let intervalId: number;

	let firstImageContainer = $state<HTMLElement>();
	let secondImageContainer = $state<HTMLElement>();
	let thirdImageContainer = $state<HTMLElement>();
	let previewImageContainer = $state<HTMLElement>();


	const targets = $derived([
		firstImageContainer,
		secondImageContainer,
		thirdImageContainer,
		previewImageContainer
	]);

	const animateImages = () => {
		const images = document.querySelectorAll('.img-thumbnail');
		images.forEach((image, index) => {
			const state = Flip.getState(image);

			const target = targets[index] ?? previewImageContainer;
			target?.appendChild(image);
			Flip.from(state, {
				duration: .8, ease: 'back.out', scale: true
			});
		});

		return () => {
			gsap.killTweensOf(targets, images);
		};
	};

	const flipToNextImage = () => {
		animateImages();


	};


	const flipToPrevImage = () => {

	};

	const resetInterval = () => {
		clearInterval(intervalId);
		intervalId = setInterval(flipToNextImage, 5000);
	};

	const handlePrev = () => {
		flipToPrevImage();
		resetInterval();
	};

	const handleNext = () => {
		flipToNextImage();
		resetInterval();
	};

	onMount(() => {
		intervalId = setInterval(flipToNextImage, 3000);

	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<div class="flex w-max flex-col gap-6">
	<section class="flex h-[30.7rem] gap-4">
		<!--Current preview image-->
		<div bind:this={previewImageContainer}
				 class="flex aspect-square h-full items-center justify-center rounded-t-full bg-muted"
				 id="preview-container">
			<img alt="current" class="img-thumbnail scale-90" src={displayImages[0]} />
		</div>

		<!--Images list-->
		<div class="flex flex-col justify-between gap-4">
			<!-- First image-->
			<div
				bind:this={firstImageContainer}
				class="relative w-[5.5rem] h-[5.5rem] rounded-full"
				id="first-image-container"
			>
				<div class="absolute rounded-b-full bottom-0 left-0 -z-10 h-1/2 w-full bg-muted"></div>
				<img alt="first" class="img-thumbnail scale-75" src={displayImages[1]} />
			</div>

			<!--Second image-->
			<div
				bind:this={secondImageContainer}
				class="relative w-[5.5rem] h-[5.5rem] rounded-full"
				id="second-image-container"
			>
				<div class="absolute rounded-b-full bottom-0 left-0 -z-10 h-1/2 w-full bg-muted"></div>
				<img alt="second" class="img-thumbnail scale-75" src={displayImages[2]} />
			</div>

			<!--Third Image-->
			<div
				bind:this={thirdImageContainer}
				class="relative w-[5.5rem] h-[5.5rem] rounded-full"
				id="third-image-container"
			>
				<div class="absolute rounded-b-full bottom-0 left-0 -z-10 h-1/2 w-full bg-muted"></div>
				<img alt="third" class="img-thumbnail scale-75" src={displayImages[3]} />
			</div>
		</div>
	</section>

	<!--	Carousel buttons-->
	<div class="ml-[30%] flex w-max items-center justify-center gap-4">
		<button
			aria-label="arrow-left"
			class="flex aspect-square w-11 cursor-pointer items-center justify-center rounded-full bg-muted"
			onclick={handlePrev}
		>
			<img alt="arrow" src={ArrowLeftIcon} />
		</button>
		<button
			aria-label="arrow-left"
			class="flex aspect-square w-11 rotate-180 cursor-pointer items-center justify-center rounded-full bg-muted"
			onclick={handleNext}
		>
			<img alt="arrow" src={ArrowLeftIcon} />
		</button>
	</div>
</div>
