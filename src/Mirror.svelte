<script lang="ts">
	import { getComputedStylesMap } from "./utils/computed-styles";
	import { SvelteMap } from "svelte/reactivity";

	let {
		source,
		value,
		currentWord,
		knownWords,
		markerRect = $bindable(),
		formatTag = (tag: string) =>
			`<span style="text-decoration:underline;">${tag}</span>`
	}: {
		value: string;
		source: HTMLInputElement | HTMLTextAreaElement;
		currentWord?: {
			name: string;
			tag: string;
			start: number;
			end: number;
		} | null;
		knownWords?: { name: string; tag: string; start: number; end: number }[];
		markerRect?: DOMRect | null;
		formatTag?: (tag: string) => string;
	} = $props();

	let markerEl: HTMLSpanElement | null = $state(null);
	$effect(() => {
		if (markerEl && currentWord) {
			markerRect = markerEl.getBoundingClientRect();
		} else {
			markerRect = null;
		}
	});

	// let defaultStyles = $derived.by(() => {
	// 	const temp = document.createElement("div");
	// 	document.documentElement.appendChild(temp);
	// 	const stylesMap = getComputedStylesMap(temp);
	// 	document.documentElement.removeChild(temp);
	// 	return stylesMap;
	// });

	let mirroredStyles = $derived(getComputedStylesMap(source));

	const cssPropRelevent = (key: string) => {
		return (
			!key.startsWith("-") && // ignore vendor prefixes
			(key.includes("color") ||
				key.includes("padding") ||
				key.includes("font") ||
				key.includes("border") ||
				key.includes("letter") ||
				key.includes("text") ||
				key.includes("line") ||
				key.includes("spacing"))
		);
	};

	let styles = new SvelteMap();
	const updatePosition = () => {
		const rect = source.getBoundingClientRect();
		const scrollLeft =
			window.pageXOffset || document.documentElement.scrollLeft;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		styles.set("width", `${rect.width}px`);
		styles.set("height", `${rect.height}px`);
		styles.set("left", `${rect.left + scrollLeft}px`);
		styles.set("top", `${rect.top + scrollTop}px`);
	};

	$effect.pre(() => {
		const resizeObserver = new ResizeObserver(updatePosition);
		resizeObserver.observe(source);
		return () => resizeObserver.disconnect();
	});

	$effect.pre(() => {
		source; // trigger
		for (let [key, value] of mirroredStyles) {
			// if (value !== defaultStyles.get(key))
			if (cssPropRelevent(key)) {
				styles.set(key, value);
			}
		}
		updatePosition();
		styles.set("position", "absolute");
		styles.set("box-sizing", "border-box");
		styles.set("pointer-events", "none");
		styles.set("white-space", "pre-wrap");
		styles.set("border-color", "transparent");
		styles.set("background-color", "transparent");
		styles.set("color", "transparent");
	});

	let styleString = $derived.by(() => {
		return Array.from(styles.entries())
			.map(([key, value]) => `${key}:${value};`)
			.join("");
	});

	function markup(text: string) {
		if (!knownWords?.length) return text;
		for (const word of knownWords) {
			if (word === currentWord) continue;
			text = text.replaceAll(word.tag, formatTag(word.tag));
		}
		return text;
	}
</script>

<div style={styleString}>
	{#if currentWord}
		{@const before = markup(value.substring(0, currentWord.start))}
		{@const after = markup(value.substring(currentWord.start))}
		{@html before}<span bind:this={markerEl}></span>{@html after}
	{:else}
		{@html markup(value)}
	{/if}
</div>
