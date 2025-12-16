<script lang="ts">
	import ArrowButton from "$lib/components/arrow-button.svelte";
	import { gsap } from "gsap";
	import { Flip } from "gsap/dist/Flip";
	import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
	import { onDestroy, onMount } from "svelte";

	// Register plugin
	gsap.registerPlugin(Flip, ScrollTrigger);

	const { heroImages } = $props();

	let intervalId: NodeJS.Timeout;

	let carouselSection = $state<HTMLElement>();
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

	const animateImagesForward = () => {
		const images = Array.from(document.querySelectorAll(".img-thumbnail")) as HTMLElement[];
		if (!images.length) return;

		// capture the state of all images before DOM changes
		const state = Flip.getState(images);

		images.forEach((image, index) => {
			const target = (targets[index] ?? previewImageContainer) as HTMLElement | undefined;
			target?.appendChild(image);
		});

		// animate once for the whole state
		Flip.from(state, { duration: 0.7, ease: "back.out", scale: true });

		return () => gsap.killTweensOf(images);
	};

	const animateImagesBackward = () => {
		const images = Array.from(document.querySelectorAll(".img-thumbnail")) as HTMLElement[];
		if (!images.length) return;

		const state = Flip.getState(images);

		// loop through containers
		targets.forEach((container, index) => {
			const image = container?.querySelector(".img-thumbnail");
			if (!image) return;

			// send this image to the previous container
			const prevIndex = (index - 1 + targets.length) % targets.length;
			targets[prevIndex]?.appendChild(image);
		});

		Flip.from(state, { duration: 0.7, ease: "back.out", scale: true });
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

	const start = () => {
		intervalId = setInterval(animateImagesForward, 5000);
	};

	const stop = () => {
		clearInterval(intervalId);
	};

	onMount(() => {
		ScrollTrigger.create({
			trigger: carouselSection,
			start: "top 80%",
			end: "bottom top",
			onEnter: () => start(),
			onEnterBack: () => start(),
			onLeave: () => stop(),
			onLeaveBack: () => stop()
		});
	});

	onDestroy(() => {
		stop();
		ScrollTrigger.killAll();
	});
</script>

<section
	bind:this={carouselSection}
	class="flex gap-3 overflow-hidden pb-16 md:max-h-[29rem] md:gap-10 md:px-14 lg:max-h-[35rem] lg:gap-6 lg:px-0 lg:pt-6"
>
	<!--Current preview image-->
	<div
		bind:this={previewImageContainer}
		class="relative flex h-full w-full items-center justify-center rounded-t-full bg-muted"
		id="preview-container"
	>
		<img alt="current" class="img-thumbnail scale-75" src={`${heroImages?.[0]?.url}`} />

		<!--	Carousel buttons-->
		<div class="absolute -bottom-16 flex items-center justify-center gap-4">
			<ArrowButton direction="left" onclick={handlePrev} />
			<ArrowButton direction="right" onclick={handleNext} />
		</div>
	</div>

	<!--Images list-->
	<div class="flex flex-col justify-between gap-4">
		<!-- First image-->
		<div
			bind:this={firstImageContainer}
			class="relative max-h-[5.5rem] max-w-[5.5rem] rounded-full"
			id="first-image-container"
		>
			<div class="absolute bottom-0 left-0 -z-10 h-1/2 w-full rounded-b-full bg-muted"></div>
			<img alt="first" class="img-thumbnail scale-75" src={`${heroImages?.[1]?.url}`} />
		</div>

		<!--Second image-->
		<div
			bind:this={secondImageContainer}
			class="relative max-h-[5.5rem] max-w-[5.5rem] rounded-full"
			id="second-image-container"
		>
			<div class="absolute bottom-0 left-0 -z-10 h-1/2 w-full rounded-b-full bg-muted"></div>
			<img alt="second" class="img-thumbnail scale-75" src={`${heroImages?.[2]?.url}`} />
		</div>

		<!--Third Image-->
		<div
			bind:this={thirdImageContainer}
			class="relative max-h-[5.5rem] max-w-[5.5rem] rounded-full"
			id="third-image-container"
		>
			<div class="absolute bottom-0 left-0 -z-10 h-1/2 w-full rounded-b-full bg-muted"></div>
			<img alt="third" class="img-thumbnail scale-75" src={`${heroImages?.[3]?.url}`} />
		</div>
	</div>
</section>
