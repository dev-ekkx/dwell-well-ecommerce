<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { buttonVariants, type Props } from "$lib/components/ui/button/index.js";

	let {
		ref = $bindable(null),
		class: className,
		size = "icon",
		isActive,
		page,
		children,
		...restProps
	}: PaginationPrimitive.PageProps &
		Props & {
			isActive: boolean;
		} = $props();
</script>

{#snippet Fallback()}
	{page.value}
{/snippet}

<PaginationPrimitive.Page
	{...restProps}
	aria-current={isActive ? "page" : undefined}
	bind:ref
	children={children || Fallback}
	class={cn(
		"cursor-pointer",
		buttonVariants({
			variant: isActive ? "outline" : "ghost",
			size
		}),
		isActive ? "bg-primary text-white hover:bg-primary hover:text-white" : "",
		className
	)}
	data-active={isActive}
	data-slot="pagination-link"
	{page}
/>
