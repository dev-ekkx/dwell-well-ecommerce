<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import CaretIcon from "$lib/assets/caret-up.svg";
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
		Content as PaginationContent,
		Ellipsis as PaginationEllipsis,
		Item as PaginationItem,
		Link as PaginationLink,
		NextButton as PaginationNextButton,
		PrevButton as PaginationPrevButton,
		Root as PaginationRoot
	} from "$lib/components/ui/pagination";
	import {
		Content as SelectContent,
		Item as SelectItem,
		Root as SelectRoot,
		Trigger as SelectTrigger
	} from "$lib/components/ui/select";
	import { Spinner } from "$lib/components/ui/spinner";
	import {
		Body as TableBody,
		Cell as TableCell,
		Head as TableHead,
		Header as TableHeader,
		Root as TableRoot,
		Row as TableRow
	} from "$lib/components/ui/table";
	import * as Tooltip from "$lib/components/ui/tooltip/index";
	import { ITEMS_PER_PAGE_OPTIONS, PRODUCT_COLUMNS } from "$lib/constants";
	import type { ProductI, ProductStatsI } from "$lib/interfaces/index";
	import { formatNumberWithCommas, setRouteParams } from "$lib/utils";
	import { PencilIcon } from "@lucide/svelte";
	import { toast } from "svelte-sonner";
	import ProductsSummaryCardsSkeleton from "./products-summary-cards-skeleton.svelte";
	import ProductsTableSekeleton from "./products-table-sekeleton.svelte";

	interface SelectedProductI {
		name: string;
		price: number;
		inventory: number;
		SKU: string;
	}

	const { data, form } = $props();
	let selectedProduct = $state<SelectedProductI>({
		name: "",
		price: 0,
		inventory: 0,
		SKU: ""
	});

	let productStat = $state<ProductStatsI>({
		totalProducts: 0,
		lowStockAlert: 0,
		pendingPricing: 0,
		totalStock: 0
	});



		let productsData = $state<{
			products: ProductI[];
			totalProducts: number;
		}>({
			products: [],
			totalProducts: 0
		});


	const products = $derived<ProductI[]>(productsData.products || []);
	const totalProducts = $derived(productStat.totalProducts);
	const productsSummary = $derived([
		{
			label: "Total Products",
			value: totalProducts,
			description: "Total number of products"
		},
		{
			label: "Total Available Stock",
			value: productStat.totalStock,
			description: "Total available stock"
		},
		{
			label: "Pricing Completion",
			value: productStat.pendingPricing,
			description: "Total products pending pricing"
		},
		{
			label: "Low Stock Alerts",
			value: productStat.lowStockAlert,
			description: "Total products with low stock"
		}
	]);
	const productInventoryForm = [
		{
			label: "Price",
			name: "price",
			productName: "",
			value: 0
		},
		{
			label: "Inventory",
			name: "inventory",
			productName: "",
			value: 0
		}
	];

	let newPrice = $state(0);
	let isLoading = $state(false);
	let dialogOpen = $state(false);
	let currentPage = $derived(parseInt(page.url.searchParams.get("page") ?? "1"));
	let itemsPerPage = $state(page.url.searchParams.get("perPage") || "10");
	const itemsPerPageOptions = $state(ITEMS_PER_PAGE_OPTIONS);
	const moreThanAPage = $derived(totalProducts / +itemsPerPage > 1);

	const isFormValid = (product: SelectedProductI) => {
		return (
			productInventoryForm.every(
				(input) => Number(product[input.name as keyof SelectedProductI]) > 0
			) || isLoading
		);
	};

	const setParams = (page?: number) => {
		setRouteParams({
			page: page ? page : currentPage,
			perPage: itemsPerPage
		});
	};

	const handleItemsPerPage = () => {
		setParams(1);
	};

	const handlePageChange = () => {
		setParams();
	};

			$effect(() => {
		data.productStatAndData.then((res) => {
			productsData = res[0];
			productStat = res[1];
		});
	});

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
				<CardTitle>Products ({products.length})</CardTitle>
			</CardHeader>
			<CardContent>
				{#await data.productStatAndData}
					<ProductsTableSekeleton columnCount={PRODUCT_COLUMNS.length} rowCount={+itemsPerPage} />
				{:then}
					{@render tableData()}
				{/await}
				<!-- Items per page and pagination -->
				<div class="mt-6 flex items-center justify-between gap-4 md:mt-8 xl:mt-10">
					<!--	Items per page select -->
					{#if products.length > 0}
						<div class="flex items-center gap-4">
							<span class="w-max">Products per page:</span>
							<SelectRoot
								bind:value={itemsPerPage}
								onValueChange={handleItemsPerPage}
								type="single"
							>
								<SelectTrigger class="w-16">{itemsPerPage}</SelectTrigger>
								<SelectContent>
									{#each itemsPerPageOptions as option (option)}
										<SelectItem value={String(option)}>{option}</SelectItem>
									{/each}
								</SelectContent>
							</SelectRoot>
						</div>
					{/if}

					<!-- Pagination -->
					{#if moreThanAPage}
						<PaginationRoot
							bind:page={currentPage}
							count={totalProducts}
							onPageChange={handlePageChange}
							perPage={+itemsPerPage}
						>
							{#snippet children({ pages, currentPage })}
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevButton class="cursor-pointer">
											<img src={CaretIcon} class="-rotate-90" alt="caret-left" />
										</PaginationPrevButton>
									</PaginationItem>

									{#each pages as page (page.key)}
										{#if page.type === "ellipsis"}
											<PaginationItem>
												<PaginationEllipsis />
											</PaginationItem>
										{:else}
											<PaginationItem>
												<PaginationLink {page} isActive={currentPage === page.value}>
													{page.value}
												</PaginationLink>
											</PaginationItem>
										{/if}
									{/each}
									<PaginationItem>
										<PaginationNextButton class="cursor-pointer">
											<img src={CaretIcon} class="rotate-90" alt="caret-left" />
										</PaginationNextButton>
									</PaginationItem>
								</PaginationContent>
							{/snippet}
						</PaginationRoot>
					{/if}
				</div>
			</CardContent>
		</CardRoot>
	</div>
</DialogRoot>

{#snippet tableData()}
	<TableRoot>
		<TableHeader>
			<TableRow>
				{#each PRODUCT_COLUMNS as column}
					<TableHead>{column.label}</TableHead>
				{/each}
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each products as product, i (product)}
				<TableRow>
					{#each PRODUCT_COLUMNS as column}
						{#if column.value === "image"}
							<TableCell>
								<img class="h-16 w-20 rounded" src={product.images[0].url} alt={product.name} />
							</TableCell>
						{:else if column.value === "price"}
							{#if product.price === 0}
								<TableCell>
									<Badge variant="secondary">Price not set</Badge>
								</TableCell>
							{:else}
								<TableCell>{formatNumberWithCommas(product.price ?? 0)}</TableCell>
							{/if}
						{:else if column.value === "action"}
							<TableCell>
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger>
											<DialogTrigger
												onclick={() => (selectedProduct = product)}
												class="cursor-pointer rounded-full p-2 transition-all duration-200 ease-linear hover:bg-primary hover:text-white"
											>
												<PencilIcon class="size-5" />
											</DialogTrigger>
										</Tooltip.Trigger>
										<Tooltip.Content class="bg-primary text-white">
											<span>Update Inventory</span>
										</Tooltip.Content>
									</Tooltip.Root>
								</Tooltip.Provider>

								<DialogContent>
									<DialogHeader>
										<DialogTitle>Update Price and Inventory</DialogTitle>
										{@render updateInventoryForm()}
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

{#snippet updateInventoryForm()}
	<form
		action="?/updateInventory"
		method="POST"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				dialogOpen = false;
				await update();
				isLoading = false;
			};
		}}
		class="mt-4 flex flex-col gap-4"
	>
		<input type="text" value={selectedProduct?.SKU} name="sku" hidden />
		{#each productInventoryForm as input}
			<div class="relative flex w-full flex-col gap-1.5">
				<Label for={input.name}>{input.label}</Label>
				<Input
					name={input.name}
					id={input.name}
					type="number"
					min="0"
					step="0.01"
					bind:value={selectedProduct[input.name as keyof SelectedProductI]}
				/>
			</div>
		{/each}
		<Button class="mt-4 cursor-pointer" type="submit" disabled={!isFormValid(selectedProduct) || isLoading}
			>
				{#if isLoading}
					<Spinner />
				{:else}
					Update
				{/if}
			</Button
		>
	</form>
{/snippet}
