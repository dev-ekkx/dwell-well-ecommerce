<script lang="ts">
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import {
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		Root as CardRoot,
		CardTitle
	} from "$lib/components/ui/card";
	import {
		Body as TableBody,
		Cell as TableCell,
		Head as TableHead,
		Header as TableHeader,
		Root as TableRoot,
		Row as TableRow
	} from "$lib/components/ui/table";
	import { PencilIcon } from "@lucide/svelte";

	const productsSummary = [
		{
			label: "Total Products",
			value: 0,
			description: "Total number of products"
		},
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
		}
	];

	const productColumns = [
		{
			label: "Image",
			value: "image"
		},
		{
			label: "Name",
			value: "name"
		},
		{
			label: "SKU",
			value: "SKU"
		},
		{
			label: "Price",
			value: "price"
		},
		{
			label: "Inventory",
			value: "inventory"
		},
		{
			label: "Average Rating",
			value: "averageRating"
		},
		{
			label: "Review Count",
			value: "reviewCount"
		},
		{
			label: "Action",
			value: "action"
		}
	];


	const {data} = $props()
	const products = $derived(data.products || [])
	$inspect(products[0])
	const totalProducts = $derived(data.totalProducts || 0)
</script>

<div class="flex flex-col gap-10">
	<section class="grid grid-cols-4 gap-4">
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

	<!-- Table section -->
	<CardRoot>
		<CardHeader>
			<CardTitle>Products</CardTitle>
		</CardHeader>
		<CardContent>
			<TableRoot>
				<TableHeader>
					<TableRow>
						{#each productColumns as column}
							<TableHead>{column.label}</TableHead>
						{/each}
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each products as product, i (product)}
						<TableRow>
							{#each productColumns as column}

							{#if column.value === "image"}
								<TableCell>
									<img class="w-20 h-16 rounded" src={product.images[0].url} alt={product.name} />
								</TableCell>

							{:else if column.value === "price" && product.price === 0}
								<TableCell>
									<Badge variant="secondary">Price not set</Badge>
								</TableCell>
							{:else if column.value === "action"}
								<TableCell>
									<button class="rounded-full p-2 hover:text-white cursor-pointer hover:bg-primary transition-all duration-200 ease-linear">
										<PencilIcon class="size-5" />
									</button>
								</TableCell>
							{:else}
							<TableCell>{product[column.value as keyof typeof product]}</TableCell>
							{/if}
							{/each}
						</TableRow>
					{/each}
				</TableBody>
			</TableRoot>
		</CardContent>
	</CardRoot>
</div>
