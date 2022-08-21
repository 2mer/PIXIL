import { Plugin } from 'pixi-viewport';
import Editor from '../Editor';

export default abstract class Tool extends Plugin {
	public abstract name: string;
	public readonly editor: Editor;

	constructor(editor: Editor) {
		super(editor.viewport);
		this.editor = editor;
	}

	onAdded() {}
	onRemoved() {}
	destroy() {}
}
