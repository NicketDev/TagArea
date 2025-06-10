export const wrapFetch = (options: {
	fetch: (search: string) => Promise<string[]> | string[];
	pageSize?: number;
}) => {
	const cache = new Map<string, string[]>();
	const exhaustedPrefixes = new Set<string>();
	const pageSize = options.pageSize;
	return async (search: string) => {
		if (cache.has(search)) return cache.get(search)!;

		for (let i = 1; i <= search.length; i++) {
			const prefix = search.slice(0, i);
			if (exhaustedPrefixes.has(prefix)) {
				const results = cache.get(prefix) || [];
				return results.filter((r) => r.startsWith(search));
			}
		}

		const result = await options.fetch(search);
		cache.set(search, result);

		if (pageSize && result.length < pageSize) {
			exhaustedPrefixes.add(search);
		}

		return result;
	};
};
