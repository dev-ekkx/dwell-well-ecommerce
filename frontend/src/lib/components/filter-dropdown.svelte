<script lang="ts">
	import CaretUp from '$lib/assets/caret-up.svg';
	import { cn, formatNumberWithCommas } from '$lib/utils';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { FilterDropdownI } from '$lib/interfaces';
	import gsap from 'gsap';
	import { tick } from 'svelte';
	import { Slider } from '$lib/components/ui/slider';

	let {
		title,
		options,
		onValueChange,
		selectedOptions = $bindable([]),
		selectedSlides = $bindable([]),
		maxSlideValue,
		type = 'checkbox'
	}: FilterDropdownI = $props();
	let isDropdownOpen = $state(true);
	let dropdownContainer = $state<HTMLDivElement | null>(null);

	const avgSlideVal = $derived((selectedSlides[0] + selectedSlides[1]) / 2);

	const handleCheckboxChange = (slug: string) => {
		let newSelected: string[];
		const isChecked = selectedOptions.includes(slug);
		if (isChecked) {
			newSelected = selectedOptions.filter((s) => s !== slug);
		} else {
			newSelected = [...selectedOptions, slug];
		}
		selectedOptions = newSelected;

		if (onValueChange) {
			onValueChange();
		}
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
		<!-- Slider -->
		{#if type === "slider"}
			<div class="flex flex-col gap-4">
				<Slider onValueChange={onValueChange} bind:value={selectedSlides} max={maxSlideValue} step={1}
								type="multiple" />
				<div class="flex items-center justify-between gap-4">
					<span>${formatNumberWithCommas(Math.min(...selectedSlides))}</span>
					<span>${formatNumberWithCommas(avgSlideVal)}</span>
					<span>${formatNumberWithCommas(Math.max(...selectedSlides))}</span>
				</div>
			</div>
		{:else}
			<!--Checkbox-->
			<div class="flex flex-col gap-4 bg-white">
				{#if !!options}
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
				{/if}
			</div>
		{/if}
	{/if}
</div>