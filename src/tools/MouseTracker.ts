import { InteractionEvent } from 'pixi.js';
import Editor from '../Editor';
import Tool from './Tool';

export default class MouseTracker extends Tool {
	public name = 'mouse-tracker';
	public position;
	public globalPosition;

	constructor(editor: Editor) {
		super(editor);
	}

	move(e: InteractionEvent): boolean {
		this.position = this.editor.toCanvas(e).floor();
		this.globalPosition = e.data.global;

		return false;
	}
}
