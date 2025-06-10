export const getComputedStylesMap = (element: HTMLElement) => {
	const styles = getComputedStyle(element);
	const stylesMap = new Map<string, string>();
	for (let i = 0; i < styles.length; i++) {
		const property = styles[i] as string;
		const value = styles.getPropertyValue(property);
		stylesMap.set(property, value);
	}
	return stylesMap;
};
