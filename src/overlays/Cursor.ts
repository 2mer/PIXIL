import { Container, DisplayObject } from 'pixi.js';
import { Editor } from '..';
import Overlay from './Overlay';

export interface CursorOptions {
	world?: boolean;
}

const DEFAULT_CURSOR_OPTIONS: CursorOptions = { world: false };

export default class Cursor extends Overlay {
	public container: Container;
	protected options: CursorOptions;
	protected editor: Editor;

	constructor(options: CursorOptions = DEFAULT_CURSOR_OPTIONS) {
		super();

		this.options = options;

		this.container = new Container();

		this.onUpdate = this.onUpdate.bind(this);
	}

	onUpdate(delta: number) {
		if (this.options.world) {
			if (this.editor.mousePosition)
				this.container.position.copyFrom(this.editor.mousePosition);
		} else {
			if (this.editor.globalMousePosition)
				this.container.position.copyFrom(
					this.editor.globalMousePosition
				);
		}
	}

	onAdded(editor: Editor, container: Container<DisplayObject>): void {
		this.editor = editor;

		editor.onUpdate.sub(this.onUpdate);
		container.addChild(this.container);
	}

	onRemoved(editor: Editor, container: Container<DisplayObject>): void {
		editor.onUpdate.unsub(this.onUpdate);
		container.removeChild(this.container);
	}

	destroy(): void {
		this.container.destroy();
	}
}
