<script lang="ts">
	import ProductCard from "../../routes/shop/product-card.svelte";
	import type { ProductI } from "$lib/interfaces";

	const { title } = $props();

	const products: ProductI[] = [
		{
			name: "Ergonomic Mesh Chair",
			SKU: "EMC-001",
			price: 199.99,
			oldPrice: 249.99,
			slug: "ergonomic-mesh-chair",
			images: [
				{ url: "/images/products/ergonomic-mesh-chair-1.jpg" },
				{ url: "/images/products/ergonomic-mesh-chair-2.jpg" }
			]
		},
		{
			name: "Ergonomic Mesh Chair",
			SKU: "EMC-002",
			price: 199.99,
			oldPrice: 249.99,
			slug: "ergonomic-mesh-chair",
			images: [
				{ url: "/images/products/ergonomic-mesh-chair-1.jpg" },
				{ url: "/images/products/ergonomic-mesh-chair-2.jpg" }
			]
		},
		{
			name: "Ergonomic Mesh Chair",
			SKU: "EMC-003",
			price: 199.99,
			oldPrice: 249.99,
			slug: "ergonomic-mesh-chair",
			images: [
				{ url: "/images/products/ergonomic-mesh-chair-1.jpg" },
				{ url: "/images/products/ergonomic-mesh-chair-2.jpg" }
			]
		},
		{
			name: "Ergonomic Mesh Chair",
			SKU: "EMC-004",
			price: 199.99,
			oldPrice: 249.99,
			slug: "ergonomic-mesh-chair",
			images: [
				{ url: "/images/products/ergonomic-mesh-chair-1.jpg" },
				{ url: "/images/products/ergonomic-mesh-chair-2.jpg" }
			]
		},
		{
			name: "Ergonomic Mesh Chair",
			SKU: "EMC-005",
			price: 199.99,
			oldPrice: 249.99,
			slug: "ergonomic-mesh-chair",
			images: [
				{ url: "/images/products/ergonomic-mesh-chair-1.jpg" },
				{ url: "/images/products/ergonomic-mesh-chair-2.jpg" }
			]
		}
	];
</script>

<div class="flex flex-col gap-10">
	<span class="text-2xl leading-8 font-semibold">Related products</span>

	<section class="flex flex-col gap-4 md:flex-row md:justify-between">
		{#each products as product (product.SKU)}
			<ProductCard {...product} />
		{/each}
	</section>
</div>
