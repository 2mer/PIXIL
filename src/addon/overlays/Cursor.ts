import { Container } from 'pixi.js';
import Editor from '../../Editor';
import Addon from '../Addon';

export interface CursorOptions {
	world?: boolean;
}

const DEFAULT_CURSOR_OPTIONS: CursorOptions = { world: false };

export default class Cursor extends Addon {
	public container: Container;
	protected options: CursorOptions;

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

	onAdded(editor: Editor): void {
		this.editor = editor;

		editor.onUpdate.sub(this.onUpdate);
		editor.overlayContainer.addChild(this.container);
	}

	onRemoved(editor: Editor): void {
		editor.onUpdate.unsub(this.onUpdate);
		editor.overlayContainer.removeChild(this.container);
	}

	destroy(): void {
		this.container.destroy();
	}
}
