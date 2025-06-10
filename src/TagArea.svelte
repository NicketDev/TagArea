<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { findTags, delimiterChars } from "./utils/string";
	import debounce from "just-debounce-it";
	import Mirror from "./Mirror.svelte";
	import TagDropdown from "./TagDropdown.svelte";
	import { wrapFetch } from "./utils/fetch";

	let {
		input,
		data,
		formatTag
	}: {
		input: HTMLInputElement | HTMLTextAreaElement;
		data: Parameters<typeof wrapFetch>[0];
		formatTag?: (tag: string) => string;
	} = $props();

	let markerRect = $state<DOMRect | null>(null);
	let wrappedFetch = $derived(wrapFetch(data));
	let cursorPosition = $state(-1);
	let inputValue = $state(input.value);
	let knownWords = $state<ReturnType<typeof findTags>>([]);

	const updateCursorPosition = debounce(() => {
		cursorPosition =
			input === document.activeElement ? input.selectionStart || -1 : -1;
	}, 150);

	let currentWord = $derived.by(() => {
		if (cursorPosition === -1) return null;
		const potentialWord = knownWords.find((w) => w.end >= cursorPosition); // first word that ends after cursor
		if (!potentialWord || potentialWord.start > cursorPosition) return null;
		return potentialWord;
	});

	const updateKnownWords = debounce(() => {
		const tags = findTags(input.value);
		if (
			knownWords.length !== tags.length ||
			JSON.stringify(knownWords) !== JSON.stringify(tags)
		) {
			knownWords = tags;
		}
	}, 500);

	const updateState = () => {
		if (cursorPosition !== input.selectionStart) updateCursorPosition();
		if (
			inputValue.length !== input.value.length ||
			inputValue !== input.value
		) {
			inputValue = input.value;
			updateKnownWords();
		}
	};

	const handleBlur = () => {
		cursorPosition = -1;
	};

	let selectedTag = $state<string | null>(null);

	function handleTagSelect(option: string) {
		if (!currentWord) return;
		const before = input.value.slice(0, currentWord.start);
		const after = input.value.slice(currentWord.end);
		const tag = option.includes(" ") ? `@[${option}]` : `@${option}`;
		input.value =
			before +
			tag +
			(delimiterChars.has(after.charAt(0)) ? after : " " + after);
		selectedTag = option;
		input.selectionStart = before.length + tag.length + 1;
		updateState();
	}

	onMount(() => {
		input.addEventListener("input", updateState);
		input.addEventListener("focus", updateState);
		input.addEventListener("blur", handleBlur);
		input.addEventListener("keyup", updateState);
		input.addEventListener("click", updateState);
	});
	onDestroy(() => {
		input.removeEventListener("input", updateState);
		input.removeEventListener("focus", updateState);
		input.removeEventListener("blur", handleBlur);
		input.removeEventListener("keyup", updateState);
		input.removeEventListener("click", updateState);
	});
</script>

<Mirror
	source={input}
	value={inputValue}
	{currentWord}
	{knownWords}
	bind:markerRect
	{formatTag}
/>
{#if currentWord}
	<TagDropdown
		{markerRect}
		{currentWord}
		fetchData={wrappedFetch}
		{input}
		onSelect={handleTagSelect}
	/>
{/if}
