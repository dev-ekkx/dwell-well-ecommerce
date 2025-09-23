<script lang="ts">
	const data = [
		{
			label: 'Years of Excellence',
			value: 30
		},
		{
			label: 'Clients',
			value: 15000
		},
		{
			label: 'Countries',
			value: 12
		},
		{
			label: 'Client Satisfaction',
			value: 98
		}
	];
</script>

<section class="flex flex-col gap-6 g-mt g-px">
	<h4>building dreams since 1990</h4>
	<p>Founded with a vision to redefine modern living, DwellWell has evolved from a small family business to a global
		leader in premium home construction. Our journey has been guided by an unwavering commitment to excellence,
		innovation, and creating spaces that truly feel like home.</p>
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		{#each data as item (item.label)}
			<div class="flex-col gap-2 items-center justify-center">
				<span>{item.value}</span>
				<span>{item.label}</span>
			</div>
		{/each}
	</div>
</section>