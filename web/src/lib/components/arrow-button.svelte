<script lang="ts">
	import ArrowLeftIcon from "$lib/assets/arrow-left.svg";
	import type { ButtonI } from "$lib/interfaces";
	import { cn } from "$lib/utils";

	const { direction, class: klass, ...rest }: ButtonI = $props();
</script>

<button
	{...rest}
	aria-label={`arrow-${direction}`}
	class={cn(
		"flex aspect-square w-11 cursor-pointer items-center justify-center rounded-full bg-muted",
		klass
	)}
>
	<img
		alt={`arrow-${direction}`}
		class={cn("", {
			"rotate-180 transform": direction === "right"
		})}
		src={ArrowLeftIcon}
	/>
</button>
