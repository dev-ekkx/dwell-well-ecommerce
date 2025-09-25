export function useIsMobile() {
	let isMobile = $state(false);

	$effect(() => {
		if (typeof window === "undefined") return;

		const mediaQuery = window.matchMedia("(max-width: 63.9rem)");
		isMobile = mediaQuery.matches;

		const handler = (event: MediaQueryListEvent) => {
			isMobile = event.matches;
		};
		mediaQuery.addEventListener("change", handler);

		return () => {
			mediaQuery.removeEventListener("change", handler);
		};
	});

	return () => isMobile;
}
