<script lang="ts">
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import {
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		Root as CardRoot,
		CardTitle
	} from "$lib/components/ui/card";
	import {
		Content as DialogContent,
		Header as DialogHeader,
		Root as DialogRoot,
		Title as DialogTitle,
		Trigger as DialogTrigger
	} from "$lib/components/ui/dialog/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Label } from "$lib/components/ui/label";
	import {
		Body as TableBody,
		Cell as TableCell,
		Head as TableHead,
		Header as TableHeader,
		Root as TableRoot,
		Row as TableRow
	} from "$lib/components/ui/table";
	import * as Tooltip from "$lib/components/ui/tooltip/index";
	import type { ProductI } from "$lib/interfaces/index";
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

	const { data } = $props();
	const products = $derived(data.products || []);
	$inspect(products[0]);
	const totalProducts = $derived(data.totalProducts || 0);

	const productPriceForm = [
		{
			label: "Old Price",
			name: "oldPrice",
			productName: "",
			readonly: true
		},
		{
			label: "New Price",
			name: "newPrice",
			productName: "",
			placeholder: "Enter new price"
		}
	];

	let newPrice = $state(0);

	const isFormValid = $derived(() => {
		return newPrice > 0;
	});

	const handleNewPriceInput = (e: Event) => {
		const value = +(e.target as HTMLInputElement).value;
		if (value <= 0) return;
		newPrice = value;
	};
	$inspect(newPrice);
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
	<DialogRoot>
		<CardRoot>
			<CardHeader>
				<CardTitle>Products</CardTitle>
				{new Date().toISOString()}
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
											<img
												class="h-16 w-20 rounded"
												src={product.images[0].url}
												alt={product.name}
											/>
										</TableCell>
									{:else if column.value === "price" && product.price === 0}
										<TableCell>
											<Badge variant="secondary">Price not set</Badge>
										</TableCell>
									{:else if column.value === "action"}
										<TableCell>
											<Tooltip.Provider>
												<Tooltip.Root>
													<Tooltip.Trigger>
														<DialogTrigger
															class="cursor-pointer rounded-full p-2 transition-all duration-200 ease-linear hover:bg-primary hover:text-white"
														>
															<PencilIcon class="size-5" />
														</DialogTrigger>
													</Tooltip.Trigger>
													<Tooltip.Content class="bg-primary text-white">
														<span>Update Price</span>
													</Tooltip.Content>
												</Tooltip.Root>
											</Tooltip.Provider>

											<DialogContent>
												<DialogHeader>
													<DialogTitle>Update Price</DialogTitle>
													{@render updatePriceForm(product)}
												</DialogHeader>
											</DialogContent>
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
	</DialogRoot>
</div>

{#snippet updatePriceForm(product: ProductI)}
	<form action="" class="mt-4 flex flex-col gap-4">
		{#each productPriceForm as input}
			<div class="relative flex w-full flex-col gap-1.5">
				<Label for={input.name}>{input.label}</Label>
				<Input
					name={input.name}
					id={input.name}
					value={input.name === "oldPrice" ? product.price : newPrice}
					readonly={input.name === "oldPrice"}
					type="number"
					min="0"
					oninput={(e) => handleNewPriceInput(e)}
				/>
			</div>
		{/each}
		<Button class="mt-4 cursor-pointer" type="submit" disabled={!isFormValid()}>Update Price</Button
		>
	</form>
{/snippet}
