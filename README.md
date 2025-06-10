# TagArea

A library for adding @-mention/tagging functionality to textareas, designed for easy integration into any web project.

## Features

- **Easy to integrate:** Works with any standard `<textarea>` element.
- **Customizable data source:** Fetch users or tags from any source, including asynchronous APIs.
- **Smart tag parsing:** Supports simple `@tagname` and complex `@[tag name with spaces]` syntax.
- **Framework-agnostic output:** Although built with Svelte, it compiles to vanilla JavaScript that can be used in any project.

## Installation

This library can be used in two ways: as an ES Module (`esm`) for modern web development with bundlers, or as an Immediately Invoked Function Expression (`iife`) for direct use in browsers via a `<script>` tag. Both versions are available in the `dist/` directory, with minified (`.min.js`) and non-minified (`.js`) variants.

To build the files from source, run:

```bash
bun run build
```

## Usage

### Using as an ES Module

Here is a simple example of how to use the library as an ES Module:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>TagArea Example</title>
	</head>
	<body>
		<textarea id="my-textarea" style="width: 100%; height: 200px;"></textarea>

		<script type="module">
			import { TagArea } from "./dist/index.esm.js";

			const users = ["Alice", "Bob", "Charlie", "David with a long name"];

			const tagArea = new TagArea({
				input: document.getElementById("my-textarea"),
				data: {
					fetch: async (search) => {
						// In a real application, you would fetch this from a server
						return users.filter((user) =>
							user.toLowerCase().startsWith(search.toLowerCase())
						);
					}
				},
				formatTag: (tag) => {
					// You can customize how the inserted tag is formatted
					return `<span style="color: blue;">${tag}</span>`;
				}
			});
		</script>
	</body>
</html>
```

### Using in the Browser with `<script>`

To use the library directly in a browser, include the `iife` build in your HTML. This will make the library available under the `window.TagArea` global variable.

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>TagArea Example</title>
		<script src="./dist/index.iife.min.js"></script>
	</head>
	<body>
		<textarea id="my-textarea" style="width: 100%; height: 200px;"></textarea>

		<script>
			const users = ["Alice", "Bob", "Charlie", "David with a long name"];

			const tagArea = new window.TagArea.TagArea({
				input: document.getElementById("my-textarea"),
				data: {
					fetch: async (search) => {
						// In a real application, you would fetch this from a server
						return users.filter((user) =>
							user.toLowerCase().startsWith(search.toLowerCase())
						);
					}
				},
				formatTag: (tag) => {
					// You can customize how the inserted tag is formatted
					return `<span style="color: blue;">${tag}</span>`;
				}
			});
		</script>
	</body>
</html>
```

## Styling

The appearance of the tags and the dropdown menu can be customized using CSS variables. You can set these variables in your own stylesheet to override the default styles.

### Tag Styling

These variables control the appearance of the tags that are rendered in the mirrored element.

| Variable                                  | Default     | Description                               |
| ----------------------------------------- | ----------- | ----------------------------------------- |
| `--tagarea-tag-color`                     | `inherit`   | The text color of the tag.                |
| `--tagarea-tag-background-color`          | `inherit`   | The background color of the tag.          |
| `--tagarea-tag-font-weight`               | `inherit`   | The font weight of the tag.               |
| `--tagarea-tag-font-style`                | `inherit`   | The font style of the tag.                |
| `--tagarea-tag-font-size`                 | `inherit`   | The font size of the tag.                 |
| `--tagarea-tag-font-family`               | `inherit`   | The font family of the tag.               |
| `--tagarea-tag-text-transform`            | `inherit`   | The text transform of the tag.            |
| `--tagarea-tag-text-align`                | `inherit`   | The text align of the tag.                |
| `--tagarea-tag-text-decoration-line`      | `underline` | The text decoration line of the tag.      |
| `--tagarea-tag-text-decoration-color`     | `inherit`   | The text decoration color of the tag.     |
| `--tagarea-tag-text-decoration-style`     | `inherit`   | The text decoration style of the tag.     |
| `--tagarea-tag-text-decoration-thickness` | `inherit`   | The text decoration thickness of the tag. |
| `--tagarea-tag-border`                    | `inherit`   | The border of the tag.                    |
| `--tagarea-tag-border-radius`             | `0`         | The border radius of the tag.             |

### Dropdown Styling

These variables control the appearance of the dropdown menu and its options.

| Variable                                              | Default                         | Description                                   |
| ----------------------------------------------------- | ------------------------------- | --------------------------------------------- |
| `--tagarea-dropdown-min-width`                        | `180px`                         | The minimum width of the dropdown.            |
| `--tagarea-dropdown-background-color`                 | `#fff`                          | The background color of the dropdown.         |
| `--tagarea-dropdown-border-color`                     | `#ccc`                          | The border color of the dropdown.             |
| `--tagarea-dropdown-box-shadow`                       | `0 2px 8px rgba(0, 0, 0, 0.08)` | The box shadow of the dropdown.               |
| `--tagarea-dropdown-padding`                          | `0`                             | The padding of the dropdown.                  |
| `--tagarea-dropdown-max-height`                       | `250px`                         | The maximum height of the dropdown.           |
| `--tagarea-dropdown-font-family`                      | `sans-serif`                    | The font family of the dropdown.              |
| `--tagarea-dropdown-font-size`                        | `1rem`                          | The font size of the dropdown.                |
| `--tagarea-dropdown-color`                            | `#000`                          | The text color of the dropdown.               |
| `--tagarea-dropdown-option-padding`                   | `8px`                           | The padding of the dropdown options.          |
| `--tagarea-dropdown-option-color`                     | `inherit`                       | The text color of the dropdown options.       |
| `--tagarea-dropdown-option-background-color`          | `#fff`                          | The background color of the dropdown options. |
| `--tagarea-dropdown-option-hover-background-color`    | `#f0f4ff`                       | The background color of hovered options.      |
| `--tagarea-dropdown-option-hover-color`               | `inherit`                       | The text color of hovered options.            |
| `--tagarea-dropdown-option-selected-background-color` | `#e0e8ff`                       | The background color of selected options.     |
| `--tagarea-dropdown-option-selected-color`            | `inherit`                       | The text color of selected options.           |
| `--tagarea-dropdown-option-loading-color`             | `#888`                          | The text color of the loading indicator.      |
| `--tagarea-dropdown-option-error-color`               | `#c00`                          | The text color of the error message.          |
| `--tagarea-dropdown-option-empty-color`               | `#888`                          | The text color of the "no results" message.   |

## API Reference

### `new TagArea(options)`

Creates a new `TagArea` instance.

#### `options`

- `input` (**required**): The `<textarea>` or `<input>` element to attach to.
- `data` (**required**): An object with a `fetch` method.
  - `fetch`: An async function that takes a search string and returns an array of strings.
  - `pageSize` (optional): A number that specifies the number of items to fetch at a time. This is used to determine if there are more items to fetch.
- `formatTag` (optional): A function that takes the selected tag as a string and returns a formatted string. This is used for displaying the tag in the mirrored element, not for the value inserted into the textarea itself.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
