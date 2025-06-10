export const delimiterChars = new Set([
	" ",
	"\t",
	"\n",
	"\r",
	".",
	",",
	"!",
	"?",
	";",
	":"
]);

export function findTags(text: string) {
	const tags = [];
	const length = text.length;
	let i = 0;

	while (i < length) {
		// Find next @ symbol using indexOf
		const atIndex = text.indexOf("@", i);
		if (atIndex === -1) break;

		// Check for bracketed tag
		if (text[atIndex + 1] === "[") {
			let endBracketIndex = text.indexOf("]", atIndex + 2);
			if (endBracketIndex === -1) {
				// delimiterChars
				for (let i = atIndex + 2; i < length; i++) {
					if (delimiterChars.has(text[i] as string)) {
						endBracketIndex = i;
						break;
					}
				}
			}
			if (endBracketIndex === -1) endBracketIndex = length;
			if (endBracketIndex !== -1) {
				const name = text.slice(atIndex + 2, endBracketIndex);
				tags.push({
					start: atIndex,
					end: endBracketIndex + 1,
					name,
					tag: `@[${name}]`
				});
				i = endBracketIndex + 1;
				continue;
			}
		}

		// Handle simple tag
		let endIndex = atIndex + 1;
		// Use a for loop instead of while for better performance
		for (; endIndex < length; endIndex++) {
			const char = text[endIndex];
			if (delimiterChars.has(char as string)) {
				break;
			}
		}

		const name = text.slice(atIndex + 1, endIndex);
		tags.push({
			start: atIndex,
			end: endIndex,
			name,
			tag: `@${name}`
		});

		i = endIndex;
	}

	return tags;
}

export const randomId = () => "r" + Math.random().toString(36).substring(2);
