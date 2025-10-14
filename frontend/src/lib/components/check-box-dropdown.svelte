<script lang="ts">
	import CaretUp from '$lib/assets/caret-up.svg';
	import { cn } from '$lib/utils';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { CheckBoxDropdownI } from '$lib/interfaces';
	import gsap from 'gsap';
	import { tick } from 'svelte';

	let { title, options, selectedOptions = $bindable([]) }: CheckBoxDropdownI = $props();
	let isDropdownOpen = $state(true);
	let dropdownContainer = $state<HTMLDivElement | null>(null);


	const handleCheckboxChange = (slug: string) => {
		let newSelected: string[];
		const isChecked = selectedOptions.includes(slug);
		if (isChecked) {
			newSelected = selectedOptions.filter((s) => s !== slug);
		} else {
			newSelected = [...selectedOptions, slug];
		}
		selectedOptions = newSelected;
	};

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
				{@const checked = selectedOptions.includes(option.slug)}
				<Label class="flex options-center gap-2 **:cursor-pointer">
					<Checkbox
						{checked}
						id={option.slug}
						value={option.slug}
						onCheckedChange={() => handleCheckboxChange(option.slug)}
					/>
					<span>{option.slug}</span>
					<span>{option.name}</span>
				</Label>
			{/each}
		</div>
	{/if}
</div>