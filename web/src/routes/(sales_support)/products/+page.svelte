<script lang="ts">
	import {
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		Root as CardRoot,
		CardTitle
	} from "$lib/components/ui/card";

	const productsSummary = [
		{
			label: "Total Available Stock",
			value: 0,
			description: "Total number of products"
		},
		{
			label: "Pricing Completion",
			value: 0,
			description: "Total number of products"
		},
		{
			label: "Low Stock Alerts",
			value: 0,
			description: "Total number of products"
		},
        {
            label: "Total Products",
            value: 0,
            description: "Total number of products"
        }
	];
</script>

<div class="flex flex-col gap-4">
	<section class="grid grid-cols-3 gap-4">
        {#each productsSummary as summary}
		<CardRoot>
            <CardHeader>
				<CardTitle>{summary.label}</CardTitle>
			</CardHeader>
			<CardContent>
                <p>{summary.value}</p>
			</CardContent>
			<CardFooter>
                <CardDescription>{summary.description}</CardDescription>
			</CardFooter>
		</CardRoot>
        {/each}
	</section>
</div>
