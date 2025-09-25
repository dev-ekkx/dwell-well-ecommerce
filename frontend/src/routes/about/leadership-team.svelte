<script lang="ts">
	import CEOImage from '$lib/assets/images/ceo.jpeg';
	import Person1Image from '$lib/assets/images/person1.jpg';
	import Person2Image from '$lib/assets/images/person2.jpg';
	import Person3Image from '$lib/assets/images/person3.jpg';

	const managers = [
		{
			name: 'Emmanuel Komla Kpendo',
			position: 'Founder & Chief Executive Officer',
			image: CEOImage
		}, {
			name: 'Dela Ricch',
			position: 'Chief Operations Office',
			image: Person1Image
		}, {
			name: 'Jasmine Nun',
			position: 'Chief Financial Officer',
			image: Person2Image
		}, {
			name: 'Ruth Naomi',
			position: 'Chief Design Officer',
			image: Person3Image
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
				<img alt={manager.name} src={manager.image} class="h-full w-full object-cover object-top" />
				<div
					class="absolute flex flex-col **:text-white justify-end px-4 py-3 gap-1 bg-gradient-to-b from-transparent to-black/90 bottom-0 left-0 w-full h-3/12">
					<span class="font-semibold">{manager.name}</span>
					<span class="text-xs font-light">{manager.position}</span>
				</div>
			</div>
		{/each}
	</div>
</section>