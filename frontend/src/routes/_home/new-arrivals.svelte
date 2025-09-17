<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	import ArrowButton from '$lib/components/arrow-button.svelte';
	import LivingRoom from '$lib/assets/images/living-room.jpg';
	import Office from '$lib/assets/images/office.jpg';
	import Bedroom from '$lib/assets/images/bedroom.jpg';
	import Hall from '$lib/assets/images/hall.jpg';
	import Dining from '$lib/assets/images/dining.jpg';

	const products = [
		{ label: 'living room', img: LivingRoom },
		{ label: 'office', img: Office },
		{ label: 'bedroom', img: Bedroom },
		{ label: 'hall', img: Hall },
		{ label: 'dining', img: Dining }
	];

	// Build a repeated list to loop seamlessly by starting in the middle block
	const REPEAT = 5;
	const displayedProducts = Array.from({ length: REPEAT }, (_, r) =>
		products.map((p) => ({ ...p, _r: r }))
	).flat();

	let container = $state<HTMLElement | null>(null);
	let track = $state<HTMLElement | null>(null);
	let items = $state<HTMLElement[]>([]);
	let index = products.length;

	function computeXForIndex(i: number) {
		if (!track || items.length === 0 || !items[i]) return 0;
		const targetOffset = items[i]?.offsetLeft ?? 0;
		return -targetOffset;
	}

	function normalizeIndex() {
		// Keep the visual the same but move index back into the middle block
		const n = products.length;
		if (n === 0) return;
		const middleStart = n;
		const normalized = ((index - middleStart) % n + n) % n + middleStart;
		if (normalized !== index) {
			index = normalized;
			const x = computeXForIndex(index);
			if (track) gsap.set(track, { x });
		}
	}

	function scrollToIndex(i: number) {
		if (!track || items.length === 0) return;
		index = i;
		const x = computeXForIndex(index);
		gsap.to(track, {
			x,
			duration: 0.5,
			ease: 'power1.out',
			overwrite: 'auto',
			force3D: true,
			onComplete: normalizeIndex
		});
	}

	function handlePrev() {
		scrollToIndex(index - 1);
	}

	function handleNext() {
		scrollToIndex(index + 1);
	}

	function collectItems() {
		if (!track) return;
		items = Array.from(track.querySelectorAll(':scope > div')) as HTMLElement[];
	}

	function onResize() {
		if (!track) return;
		// Keep alignment on resize without animating or resetting to 0 (prevents jumpiness)
		const x = computeXForIndex(index);
		gsap.set(track, { x });
	}

	onMount(() => {
		collectItems();
		if (track) {
			const x = computeXForIndex(index);
			gsap.set(track, { x, willChange: 'transform', force3D: true });
		}
		const ro = new ResizeObserver(onResize);
		if (container) ro.observe(container);
		if (track) ro.observe(track);
		window.addEventListener('resize', onResize);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', onResize);
		};
	});
</script>


<section bind:this={container} class="flex flex-col gap-6 g-mt overflow-x-clip">
	<!--	Category title and arrow buttons -->
	<div class="flex items-center justify-between capitalize gap-4">
		<span
			class="font-semibold text-2xl leading-8 md:text-3xl md:leading-10 lg:text-4xl lg:leading-12">new arrivals</span>

		<!-- Arrow buttons -->
		<div class="flex items-center gap-2">
			<ArrowButton direction="left" onclick={handlePrev} />
			<ArrowButton direction="right" onclick={handleNext} />
		</div>
	</div>

	<!--Images and labels-->
	<div bind:this={track} class="flex items-center gap-4 lg:gap-6 w-max">
		{#each displayedProducts as product, idx (idx)}
			<div class="flex flex-col items-center gap-6">
				<img loading="eager" alt={`Product-${idx}`}
						 class="rounded-lg w-[14.75rem] h-[18.75rem] lg:w-[26.3rem] lg:h-[35.125rem] object-cover"
						 src={product.img} />
				<span class="capitalize text-lg font-medium">{product.label}</span>
			</div>
		{/each}
	</div>
</section>