<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { fade } from "svelte/transition";
	import { encode } from "html-entities";
	import { randomId } from "./utils/string";

	let baseId = randomId();

	let { markerRect, currentWord, fetchData, input, onSelect } = $props();

	let dropdownOptions = $state<string[]>([]);
	let dropdownLoading = $state(false);
	let dropdownActiveIndex = $state(0);
	let dropdownError = $state<string | null>(null);

	let dropdownRef: HTMLUListElement | null = $state(null);

	$effect(() => {
		if (currentWord) {
			(async () => {
				dropdownLoading = true;
				dropdownError = null;
				try {
					const result = await fetchData(currentWord.name);
					dropdownOptions = Array.isArray(result) ? result : [];
				} catch (e) {
					console.error(e);
					dropdownOptions = [];
					dropdownError = "Failed to load";
				}
				dropdownLoading = false;
				dropdownActiveIndex = 0;
			})();
		} else {
			dropdownOptions = [];
			dropdownLoading = false;
			dropdownActiveIndex = 0;
		}
	});

	$effect(() => {
		if (dropdownRef) {
			const selectedEl = dropdownRef.querySelector<HTMLLIElement>(
				`#${baseId}-tag-option-${dropdownActiveIndex}`
			);

			if (selectedEl) {
				selectedEl.scrollIntoView({
					block: "nearest",
					behavior: "smooth"
				});
			}
		}
	});

	function selectOption(option: string) {
		onSelect?.(option);
	}

	function onDropdownKeydown(e: KeyboardEvent) {
		if (!dropdownOptions.length) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			dropdownActiveIndex = (dropdownActiveIndex + 1) % dropdownOptions.length;
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			dropdownActiveIndex =
				(dropdownActiveIndex - 1 + dropdownOptions.length) %
				dropdownOptions.length;
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (dropdownOptions[dropdownActiveIndex]) {
				selectOption(dropdownOptions[dropdownActiveIndex] as string);
			}
		}
	}

	onMount(() => {
		input?.addEventListener("keydown", onDropdownKeydown);
	});
	onDestroy(() => {
		input?.removeEventListener("keydown", onDropdownKeydown);
	});
</script>

{#if markerRect}
	<ul
		bind:this={dropdownRef}
		class="tag-dropdown"
		transition:fade
		role="listbox"
		aria-label="tag suggestions"
		style:left="{markerRect.left + window.scrollX}px"
		style:top="{markerRect.bottom + window.scrollY}px"
		tabindex="0"
		aria-activedescendant={dropdownOptions[dropdownActiveIndex]
			? `${baseId}-tag-option-${dropdownActiveIndex}`
			: undefined}
	>
		{#if dropdownLoading}
			<li class="tag-option-loading">Loading…</li>
		{:else if dropdownError}
			<li class="tag-option-error">{dropdownError}</li>
		{:else if dropdownOptions.length === 0}
			<li class="tag-option-empty">No results</li>
		{:else}
			{#each dropdownOptions as option, i}
				<li
					class="tag-option"
					id={`${baseId}-tag-option-${i}`}
					role="option"
					aria-selected={dropdownActiveIndex === i}
					tabindex="-1"
					class:selected={dropdownActiveIndex === i}
					onmousedown={(e) => {
						e.preventDefault();
						selectOption(option);
					}}
					ontouchstart={(e) => {
						e.preventDefault();
						selectOption(option);
					}}
				>
					{@html encode(option).replaceAll(
						currentWord.name,
						`<strong>${currentWord.name}</strong>`
					)}
				</li>
			{/each}
		{/if}
	</ul>
{/if}

<style>
	.tag-dropdown {
		position: absolute;
		left: 0;
		top: 0;
		min-width: var(--tagarea-dropdown-min-width, 180px);
		background-color: var(--tagarea-dropdown-background-color, #fff);
		border: 1px solid var(--tagarea-dropdown-border-color, #ccc);
		border-radius: 4px;
		z-index: 1000;
		box-shadow: var(
			--tagarea-dropdown-box-shadow,
			0 2px 8px rgba(0, 0, 0, 0.08)
		);
		padding: var(--tagarea-dropdown-padding, 0);
		margin: 0;
		list-style: none;
		max-height: var(--tagarea-dropdown-max-height, 250px);
		overflow-y: auto;
		font-family: var(--tagarea-dropdown-font-family, sans-serif);
		font-size: var(--tagarea-dropdown-font-size, 1rem);
		color: var(--tagarea-dropdown-color, #000);
	}
	.tag-dropdown li {
		padding: var(--tagarea-dropdown-option-padding, 8px);
		cursor: pointer;
		transition: background-color 0.3s;
	}
	.tag-dropdown .tag-option {
		background-color: var(--tagarea-dropdown-option-background-color, #fff);
		color: var(--tagarea-dropdown-option-color, inherit);
	}
	.tag-dropdown .tag-option:hover {
		background-color: var(
			--tagarea-dropdown-option-hover-background-color,
			#f0f4ff
		);
		color: var(--tagarea-dropdown-option-hover-color, inherit);
	}
	.tag-dropdown .tag-option.selected {
		background-color: var(
			--tagarea-dropdown-option-selected-background-color,
			#e0e8ff
		);
		color: var(--tagarea-dropdown-option-selected-color, inherit);
	}
	.tag-dropdown .tag-option-loading {
		color: var(--tagarea-dropdown-option-loading-color, #888);
	}
	.tag-dropdown .tag-option-error {
		color: var(--tagarea-dropdown-option-error-color, #c00);
	}
	.tag-dropdown .tag-option-empty {
		color: var(--tagarea-dropdown-option-empty-color, #888);
	}
</style>
