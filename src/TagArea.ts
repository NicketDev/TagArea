import { mount, unmount, type ComponentProps } from "svelte";
import TagAreaComponent from "./TagArea.svelte";

export class TagArea {
	private component: ReturnType<typeof mount>;

	constructor(options: ComponentProps<typeof TagAreaComponent>) {
		this.component = mount(TagAreaComponent, {
			target: document.body,
			props: options
		});
	}
	public destroy() {
		unmount(this.component);
	}
}
