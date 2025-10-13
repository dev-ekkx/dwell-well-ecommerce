<script lang="ts">
	import CaretUp from '$lib/assets/caret-up.svg';
	import { cn } from '$lib/utils';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { CheckBoxDropdownI } from '$lib/interfaces';

	const { title, options }: CheckBoxDropdownI = $props();
	let isDropdownOpen = $state(false);

	const dropdownToggle = () => {
		isDropdownOpen = !isDropdownOpen;
	};
</script>


<div class="flex flex-col gap-4">
	<!--	Dropdown toggle button -->
	<button class="flex items-center gap-4 cursor-pointer" onclick={dropdownToggle}>
		<span class="font-semibold text-lg capitalize">{title}</span>
		<img alt="caret" class={cn('transition-all duration-200 ease-linear rotate-180', {
			'rotate-0': isDropdownOpen,
		})} src={CaretUp}>
	</button>

	<!--	Dropdown items -->
	{#if isDropdownOpen}
		<div class="flex flex-col gap-4">
			{#each options as option (option.slug)}
				<Label class="flex options-center gap-2 **:cursor-pointer">
					<Checkbox id={option.slug} />
					<span>{option.name}</span>
				</Label>
			{/each}
		</div>
	{/if}
</div>