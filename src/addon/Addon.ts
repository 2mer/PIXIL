import Editor from "../Editor";

export default class Addon {
	editor: Editor;
	onAdded(editor: Editor) {}
	onRemoved(editor: Editor) {}
	destroy() {}
}