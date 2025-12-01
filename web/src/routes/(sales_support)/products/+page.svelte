<script lang="ts">
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
		Caption as TableCaption,
		Cell as TableCell,
		Footer as TableFooter,
		Head as TableHead,
		Header as TableHeader,
		Root as TableRoot,
		Row as TableRow
	} from "$lib/components/ui/table";

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

	const invoices = [
		{
			invoice: "INV001",
			paymentStatus: "Paid",
			totalAmount: "$250.00",
			paymentMethod: "Credit Card"
		},
		{
			invoice: "INV002",
			paymentStatus: "Pending",
			totalAmount: "$150.00",
			paymentMethod: "PayPal"
		},
		{
			invoice: "INV003",
			paymentStatus: "Unpaid",
			totalAmount: "$350.00",
			paymentMethod: "Bank Transfer"
		},
		{
			invoice: "INV004",
			paymentStatus: "Paid",
			totalAmount: "$450.00",
			paymentMethod: "Credit Card"
		},
		{
			invoice: "INV005",
			paymentStatus: "Paid",
			totalAmount: "$550.00",
			paymentMethod: "PayPal"
		},
		{
			invoice: "INV006",
			paymentStatus: "Pending",
			totalAmount: "$200.00",
			paymentMethod: "Bank Transfer"
		},
		{
			invoice: "INV007",
			paymentStatus: "Unpaid",
			totalAmount: "$300.00",
			paymentMethod: "Credit Card"
		}
	];
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
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead class="w-[100px]">Invoice</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Method</TableHead>
						<TableHead class="text-end">Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each invoices as invoice (invoice)}
						<TableRow>
							<TableCell class="font-medium">{invoice.invoice}</TableCell>
							<TableCell>{invoice.paymentStatus}</TableCell>
							<TableCell>{invoice.paymentMethod}</TableCell>
							<TableCell class="text-end">{invoice.totalAmount}</TableCell>
						</TableRow>
					{/each}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colspan={3}>Total</TableCell>
						<TableCell class="text-end">$2,500.00</TableCell>
					</TableRow>
				</TableFooter>
			</TableRoot>
		</CardContent>
	</CardRoot>
</div>
