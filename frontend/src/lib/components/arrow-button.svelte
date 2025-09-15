<script lang="ts">
	import ArrowLeftIcon from '$lib/assets/arrow-left.svg';
	import type { ButtonI } from '$lib/interfaces';
	import { cn } from '$lib/utils';

	const { direction, ...rest }: ButtonI = $props();
</script>

<button
	{...rest}
	aria-label={`arrow-${direction}`}
	class="flex aspect-square w-11 cursor-pointer items-center justify-center rounded-full bg-muted"
>
	<img alt={`arrow-${direction}`} class={cn('', {
		'transform rotate-180': direction === 'right'
	})} src={ArrowLeftIcon} />
</button>