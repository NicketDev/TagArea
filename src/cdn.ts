import * as TagArea from "./TagArea";

declare global {
	interface Window {
		TagArea: typeof TagArea;
	}
}

window.TagArea = TagArea;
