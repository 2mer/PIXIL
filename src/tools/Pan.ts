// import { Drag, IDragOptions } from 'pixi-viewport';
import { DragOptions } from 'pixi-viewport';
import Editor from '../Editor';
import Tool from './Tool';

export default class Pan extends Tool {
	public name = 'pan';
	protected customDrag;

	constructor(editor: Editor, options: DragOptions = {}) {
		// constructor(editor: Editor, options: IDragOptions = {}) {
		super(editor);

		// this.customDrag = new Drag(editor.viewport, options);
	}

	onAdded(): void {
		this.editor.viewport.plugins.add('pan.drag', this.customDrag, 0);
	}

	onRemoved(): void {
		this.editor.viewport.plugins.remove('pan.drag');
	}

	pause(): void {
		super.pause();
		this.customDrag.pause();
	}

	resume(): void {
		super.resume();
		this.customDrag.resume();
	}
}
