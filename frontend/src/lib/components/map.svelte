<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any, svelte/prefer-svelte-reactivity, no-async-promise-executor */
	import { getContext, onMount } from 'svelte';

	const MAPS_API_KEY = import.meta.env.VITE_MAP_KEY as string;
	const mapCoordinates = getContext('map-coordinates') as { lat: number; lng: number };

	let mapElement = $state<HTMLElement | null>(null);
	let map = $state<google.maps.Map | null>(null);

	function loadGoogleMaps(): Promise<void> {
		return new Promise((resolve, reject) => {
			// If already available, resolve immediately
			if (typeof window !== 'undefined' && (window as any).google?.maps?.importLibrary) {
				resolve();
				return;
			}

			const g: any = { key: MAPS_API_KEY, v: 'weekly' };
			let h: any, a: HTMLScriptElement, k: any, p = 'The Google Maps JavaScript API', c = 'google', l = 'importLibrary',
				q = '__ib__', m = document, b: any = (window as any);
			b = b[c] || (b[c] = {});
			let d: any = b.maps || (b.maps = {}), r = new Set<string>(), e = new URLSearchParams(),
				u = () => h || (h = new Promise<void>(async (f, n) => {
					a = m.createElement('script');
					e.set('libraries', [...r] + '');
					for (k in g) e.set(String(k).replace(/[A-Z]/g, (t: string) => '_' + t[0].toLowerCase()), (g as any)[k]);
					e.set('callback', c + '.maps.' + q);
					a.src = 'https://maps.' + c + 'apis.com/maps/api/js?' + e.toString();
					d[q] = f;
					a.onerror = () => h = n(Error(p + ' could not load.'));
					a.nonce = (m.querySelector('script[nonce]') as HTMLScriptElement)?.nonce || '';
					m.head.append(a);
				}));

			if (d[l]) {
				console.warn(p + ' only loads once. Ignoring:', g);
				resolve();
				return;
			} else {
				d[l] = (f: string, ...n: any[]) => r.add(f) && u().then(() => d[l](f, ...n));
			}

			u().then(() => resolve()).catch(reject);
		});
	}


	const initMap = async () => {
		// The location of DwellWell
		const position = {
			lat: mapCoordinates.lat,
			lng: mapCoordinates.lng
		};

		await loadGoogleMaps();

		const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
		const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

		// Ensure the container element is available (narrow type from HTMLElement | null to HTMLElement)
		if (!mapElement) {
			console.error('Map container element is not available.');
			return;
		}

		map = new Map(
			mapElement,
			{
				zoom: 20,
				center: position,
				mapId: 'DwellWellMap'
			}
		);

		// The marker, positioned at DwellWell
		new AdvancedMarkerElement({
			map: map,
			position: position,
			title: 'DwellWell'
		});
	};


	onMount(async () => {
		await initMap();
	});
</script>

<div bind:this={mapElement} class="h-[38.4rem]">
	<!--	TODO: remove map placeholder-->
	<div
		class="w-full h-full flex items-center justify-center text-2xl text-muted-foreground border border-muted-foreground">
		Map
		placeholder
	</div>
</div>
