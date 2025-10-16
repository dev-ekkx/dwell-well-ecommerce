let searchTerm = $state("");

const setSearchTerm = (term: string) => (searchTerm = term);

const getSearchTerm = () => searchTerm;

export const useSearchAndFilter = () => {
	return {
		setSearchTerm,
		getSearchTerm
	};
};
