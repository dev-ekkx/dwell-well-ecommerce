<script lang="ts">
	import { formatNumberWithCommas } from '$lib/utils';
	import type { GlobalReachI } from '$lib/interfaces';

	const { globalReachData }: { globalReachData: GlobalReachI } = $props();

	// Svelte action to animate numbers smoothly with GSAP when the element enters the viewport
	function countTo(node: HTMLElement, params: { value: number; format?: (n: number) => string; duration?: number }) {
		let { value, format, duration = 2 } = params;
		let observer: IntersectionObserver | null = null;
		let killed = false;

		const start = async () => {
			// Lazy-import gsap only in the browser to avoid SSR issues
			const { gsap } = await import('gsap');
			const counter = { n: 0 };
			gsap.to(counter, {
				n: value,
				duration,
				ease: 'power2.out',
				onUpdate: () => {
					if (killed) return;
					const current = Math.round(counter.n);
					node.textContent = format ? format(current) : String(current);
				}
			});
		};

		// Observe when the element is in view to trigger the animation once
		observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					observer?.disconnect();
					observer = null;
					start();
				}
			}
		}, { threshold: 0.3 });
		observer.observe(node);

		return {
			destroy() {
				killed = true;
				observer?.disconnect();
			}
		};
	}
</script>

<section class="flex flex-col gap-6 g-mt g-px">
	<h4 class="text-section-head capitalize text-center">{globalReachData.title}</h4>
	<p class="text-center text-section-p max-w-[65rem]">{globalReachData.description}</p>
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		{#each globalReachData.reaches as item (item.label)}
			<div class="flex flex-col gap-4 items-center justify-center py-6">
				<span class="text-5xl leading-14 font-medium text-primary flex items-center">
					<span
						use:countTo={{ value: item.value, format: item.label.toLowerCase() === 'clients' ? formatNumberWithCommas : undefined }}></span>
					{#if ['years of excellence', 'clients'].includes(item.label.toLowerCase())}
					<span>+</span>
					{/if}
					{#if item.label.toLowerCase() === "client satisfaction"}
					<span>%</span>
					{/if}
				</span>
				<span class="text-muted-foreground">{item.label}</span>
			</div>
		{/each}
	</div>
</section>