<script lang="ts">
	import CaretUp from '$lib/assets/caret-up.svg';
	import { cn } from '$lib/utils';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { CheckBoxDropdownI } from '$lib/interfaces';
	import gsap from 'gsap';
	import { tick } from 'svelte';

	const { title, options }: CheckBoxDropdownI = $props();
	let isDropdownOpen = $state(false);
	let dropdownContainer = $state<HTMLDivElement | null>(null);

	// const dropdownToggle = () => {
	//
	// 	isDropdownOpen = !isDropdownOpen;
	//
	// 	// Animate based on the new state
	// 	if (dropdownContainer) {
	// 		if (isDropdownOpen) {
	// 			// Animate open
	// 			gsap.to(dropdownContainer, {
	// 				height: 'auto',
	// 				duration: 0.6,
	// 				ease: 'power4.out'
	// 			});
	// 		} else {
	// 			// Animate closed
	// 			gsap.to(dropdownContainer, {
	// 				height: 10,
	// 				duration: 0.6,
	// 				ease: 'power4.out'
	// 			});
	// 		}
	// 	}
	// };


	const dropdownToggle = async () => {
		if (!dropdownContainer) return;

		if (isDropdownOpen) {
			gsap.to(dropdownContainer, {
				height: '2rem',
				duration: 0.4,
				ease: 'power4.out',
				onComplete: () => {
					isDropdownOpen = false;

				}
			});
		} else {
			gsap.set(dropdownContainer, { clearProps: 'height,opacity' });
			isDropdownOpen = true;
			await tick();
			gsap.from(dropdownContainer, {
				height: 0,
				duration: 0.4,
				ease: 'power4.out'
			});
		}
	};

</script>


<div bind:this={dropdownContainer} class="flex flex-col gap-4  overflow-y-clip">
	<!--	Dropdown toggle button -->
	<button class="flex items-center justify-between gap-4 cursor-pointer" onclick={dropdownToggle}>
		<span class="font-semibold text-lg capitalize">{title}</span>
		<img alt="caret" class={cn('transition-all duration-200 ease-linear rotate-180', {
			'rotate-0': isDropdownOpen,
		})} src={CaretUp}>
	</button>

	<!--	Dropdown items -->
	{#if isDropdownOpen}
		<div class="flex flex-col gap-4 bg-white">
			{#each options as option (option.slug)}
				<Label class="flex options-center gap-2 **:cursor-pointer">
					<Checkbox id={option.slug} />
					<span>{option.name}</span>
				</Label>
			{/each}
		</div>
	{/if}
</div>