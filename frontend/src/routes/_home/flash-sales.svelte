<script lang="ts">
	import FlashSalesImage from '$lib/assets/images/category16.jpg';
	import { Button } from '$lib/components/ui/button';
</script>

<section class="grid grid-cols-1 md:grid-cols-2 md:max-h-[28rem] g-mt rounded-lg lg:overflow-hidden">
	<img alt="flash sales" class="object-cover w-full max-h-[19rem] lg:max-h-auto" src={FlashSalesImage}>
	<div class="bg-muted-foreground px-6 py-10 flex flex-col gap-10 lg:items-start lg:justify-center **:text-white">
		<div class="flex flex-col gap-2">
			<span class="font-bold text-2xl">FLASH SALE: 25% OFF All Living Room Furniture</span>
			<p class="font-medium">Refresh your space for less! Use code <b>NEWSPACE</b> at checkout. Ends March 31st. Free
				shipping on orders
				over
				$500</p>
		</div>
		<Button class="font-bold cursor-pointer">Learn More</Button>
	</div>
</section>