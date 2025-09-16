<script lang="ts">
	import Image1 from '$lib/assets/images/hero-image5.png';
	import Image2 from '$lib/assets/images/hero-image2.png';
	import Image3 from '$lib/assets/images/hero-image3.png';
	import Image4 from '$lib/assets/images/hero-image4.png';
	import { gsap } from 'gsap';
	import { Flip } from 'gsap/dist/Flip';
	import { onDestroy, onMount } from 'svelte';
	import ArrowButton from '$lib/components/arrow-button.svelte';

	// Register plugin
	gsap.registerPlugin(Flip);

	let displayImages = $state([Image1, Image2, Image3, Image4]);
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

	/*
	const animateImages = () => {
		const images = document.querySelectorAll('.img-thumbnail');
		images.forEach((image, index) => {
			const state = Flip.getState(image);

			const target = targets[index] ?? previewImageContainer;
			target?.appendChild(image);
			Flip.from(state, {
				duration: 1, ease: 'back.out', scale: true
			});
		});

		return () => {
			gsap.killTweensOf(targets, images);
		};
	};

	const flipToNextImage = () => {
		animateImages();
	};
	 **/

	const animateImagesForward = () => {
		const images = Array.from(document.querySelectorAll('.img-thumbnail')) as HTMLElement[];
		if (!images.length) return;

		// capture the state of all images before DOM changes
		const state = Flip.getState(images);

		images.forEach((image, index) => {
			const target = (targets[index] ?? previewImageContainer) as HTMLElement | undefined;
			target?.appendChild(image);
		});

		// animate once for the whole state
		Flip.from(state, { duration: 0.7, ease: 'back.out', scale: true });

		return () => gsap.killTweensOf(images);
	};


	const animateImagesBackward = () => {
		const images = Array.from(document.querySelectorAll('.img-thumbnail')) as HTMLElement[];
		if (!images.length) return;

		const state = Flip.getState(images);

		// loop through containers
		targets.forEach((container, index) => {
			const image = container?.querySelector('.img-thumbnail');
			if (!image) return;

			// send this image to the previous container
			const prevIndex = (index - 1 + targets.length) % targets.length;
			targets[prevIndex]?.appendChild(image);
		});

		Flip.from(state, { duration: 0.7, ease: 'back.out', scale: true });
		return () => gsap.killTweensOf(targets);
	};


	const resetInterval = () => {
		clearInterval(intervalId);
		intervalId = setInterval(animateImagesForward, 5000);
	};

	const handlePrev = () => {
		animateImagesBackward();
		resetInterval();
	};

	const handleNext = () => {
		animateImagesForward();
		resetInterval();
	};

	onMount(() => {
		intervalId = setInterval(animateImagesForward, 5000);

	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>


<section
	class="pb-16 flex gap-3 md:gap-10 md:px-14 md:max-h-[29rem] lg:pt-6 lg:px-0 lg:gap-6 lg:max-h-[35rem] overflow-hidden">
	<!--Current preview image-->
	<div bind:this={previewImageContainer}
			 class="relative flex h-full items-center w-full justify-center rounded-t-full bg-muted"
			 id="preview-container">
		<img alt="current" class="img-thumbnail scale-75" src={displayImages[0]} />

		<!--	Carousel buttons-->
		<div class="absolute flex -bottom-16 items-center justify-center gap-4">
			<ArrowButton direction="left" onclick={handlePrev} />
			<ArrowButton direction="right" onclick={handleNext} />
		</div>
	</div>

	<!--Images list-->
	<div class="flex flex-col justify-between gap-4">
		<!-- First image-->
		<div
			bind:this={firstImageContainer}
			class="relative max-w-[5.5rem] max-h-[5.5rem] rounded-full"
			id="first-image-container"
		>
			<div class="absolute rounded-b-full bottom-0 left-0 -z-10 h-1/2 w-full bg-muted"></div>
			<img alt="first" class="img-thumbnail scale-75" src={displayImages[1]} />
		</div>

		<!--Second image-->
		<div
			bind:this={secondImageContainer}
			class="relative max-w-[5.5rem] max-h-[5.5rem] rounded-full"
			id="second-image-container"
		>
			<div class="absolute rounded-b-full bottom-0 left-0 -z-10 h-1/2 w-full bg-muted"></div>
			<img alt="second" class="img-thumbnail scale-75" src={displayImages[2]} />
		</div>

		<!--Third Image-->
		<div
			bind:this={thirdImageContainer}
			class="relative max-w-[5.5rem] max-h-[5.5rem] rounded-full"
			id="third-image-container"
		>
			<div class="absolute rounded-b-full bottom-0 left-0 -z-10 h-1/2 w-full bg-muted"></div>
			<img alt="third" class="img-thumbnail scale-75" src={displayImages[3]} />
		</div>
	</div>
</section>


