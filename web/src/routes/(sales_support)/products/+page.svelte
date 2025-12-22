<script lang="ts">
	import { enhance } from "$app/forms";
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
	import type { ProductI, ProductStatsI } from "$lib/interfaces/index";
	import { PencilIcon } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import ProductsSummaryCardsSkeleton from "./products-summary-cards-skeleton.svelte";
	import ProductsTableSekeleton from "./products-table-sekeleton.svelte";

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

	const { data, form } = $props();
	let productsData = $state<{
		products: ProductI[];
		totalProducts: number;
	}>({
		products: [],
		totalProducts: 0
	});
	let productStat = $state<ProductStatsI>({
		totalProducts: 0,
		lowStockAlert: 0,
		pendingPricing: 0,
		totalStock: 0
	});

	let productsStat = $state<{
		productsData: {
			products: ProductI[];
			totalProducts: number;	
		};
		productStat: ProductStatsI;
	}>({
		productsData: {
			products: [],
			totalProducts: 0
		},
		productStat: {
			totalProducts: 0,
			lowStockAlert: 0,
			pendingPricing: 0,
			totalStock: 0
		}
	})
	const products = $derived(productsData.products || []);
	const totalProducts = $derived(productsData.totalProducts || 0);
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
	let isLoading = $state(false);
	let dialogOpen = $state(false);

	const isFormValid = $derived(() => {
		return newPrice > 0 || isLoading;
	});

	const handleNewPriceInput = (e: Event) => {
		const value = +(e.target as HTMLInputElement).value;
		if (value <= 0) return;
		newPrice = value;
	};

	$effect(() => {
		if (form?.error) {
			console.log(form.error);
			toast.error("Failure", { description: form.error, position: "top-right" });
		}
	});

	$effect(() => {
		if (dialogOpen) {
			newPrice = 0;
			isLoading = false;
		}
	});

	onMount(() => {
		
		data.productStatAndData.then((res) => {
			productsData = res[0];
			productStat = res[1];
		});
	});
</script>

<DialogRoot bind:open={dialogOpen}>
<div class="flex flex-col gap-10">
	{#await data.productStatAndData}
	<ProductsSummaryCardsSkeleton />
	{:then}
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
		{/await}

	<!-- Table section -->
		<CardRoot>
			<CardHeader>
				<CardTitle>Products</CardTitle>
			</CardHeader>
			<CardContent>
				{#await data.productStatAndData}
				<ProductsTableSekeleton />
				{:then} 
				{@render tableData()}
				{/await}
			</CardContent>
		</CardRoot>
	</div>
</DialogRoot>


{#snippet tableData()}
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
{/snippet}
	

{#snippet updatePriceForm(product: ProductI)}
	<form
		action="?/updatePrice"
		method="POST"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				await update();
				isLoading = false;
			};
		}}
		class="mt-4 flex flex-col gap-4"
	>
		<input type="text" value={product.SKU} name="sku" hidden />
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
