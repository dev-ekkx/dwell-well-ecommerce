<script lang="ts">
	import HeroCarousel from './hero-carousel.svelte';
	import { Button } from '$lib/components/ui/button';
</script>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-14">
	<!--	Product summary section-->
	<section class="flex flex-col gap-10 2xl:max-w-[70%]">
		<div class="flex flex-col gap-6">
			<h1 class="font-semibold text-2xl capitalize md:text-4xl lg:text-5xl leading-8 md:leading-12 lg:leading-16">
				quality furniture
				for every home &
				office</h1>
			<p>Your ultimate destination for premium furniture that blends elegance, comfort, and functionality. Whether
				you're
				revamping your living room, upgrading your office ,we bring you an exquisite collection tailored to your
				taste</p>
		</div>
		<div class="flex flex-col gap-2 sm:flex-row sm:gap-5 md:gap-6">
			<Button aria-label="shop now" class="cursor-pointer font-semibold">Shop now</Button>
			<Button aria-label="learn more"
							class="border-primary font-semibold text-primary cursor-pointer hover:text-primary"
							variant="outline">Learn more
			</Button>
		</div>

	</section>

	<!--	Carousel section-->
	<HeroCarousel />
</div>
