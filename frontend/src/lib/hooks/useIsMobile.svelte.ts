export function useIsMobileSvelte() {
	let isMobile = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;

		const mediaQuery = window.matchMedia('(max-width: 48rem)');

		// set initial value
		isMobile = mediaQuery.matches;

		// update on changes
		const handler = (event: MediaQueryListEvent) => {
			isMobile = event.matches;
		};
		mediaQuery.addEventListener('change', handler);

		// cleanup
		return () => {
			mediaQuery.removeEventListener('change', handler);
		};
	});

	return () => isMobile;
}
