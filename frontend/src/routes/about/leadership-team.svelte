<script lang="ts">
	import CEOImage from '$lib/assets/images/ceo.jpeg';

	const managers = [
		{
			name: 'Emmanuel Komla Kpendo',
			position: 'Founder & CEO',
			image: CEOImage
		}
	];
</script>

<section class="g-px g-mt-pt flex flex-col gap-6">
	<h4 class="text-section-head text-center">our leadership team</h4>

	<p class="px-4 text-center w-full max-w-[40rem] mx-auto">Guided by passion and experience, our leaders shape the
		vision of AmaliHomes, bringing comfort, style, and quality to homes worldwide.</p>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each managers as manager (manager.name)}
			<div class="h-[28rem] lg:h-[23rem] relative rounded-lg overflow-hidden">
				<img alt={manager.name} src={manager.image} class="h-full object-cover" />
				<div
					class="absolute flex flex-col **:text-white justify-end px-4 py-3 gap-1 bg-gradient-to-b from-transparent via-transparent to-black/80 bottom-0 left-0 w-full h-5/12">
					<span class="font-semibold">{manager.name}</span>
					<span class="text-xs font-light">{manager.position}</span>
				</div>
			</div>
		{/each}
	</div>
</section>