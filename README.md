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
