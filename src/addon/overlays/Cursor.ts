import { Container } from 'pixi.js';
import Editor from '../../Editor';
import Point from '../../Point';
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

		this.onFrameEnd = this.onFrameEnd.bind(this);
	}

	onFrameEnd(delta: number) {
		if (this.options.world) {
			if (this.editor.mousePosition) {
				
				const localPoint = new Point().copyFrom(this.editor.viewport.toWorld(this.editor.globalMousePosition)).floor();

				this.container.position.copyFrom(localPoint);
			}
		} else {
			if (this.editor.globalMousePosition)
				this.container.position.copyFrom(
					this.editor.globalMousePosition
				);
		}
	}

	onAdded(editor: Editor): void {
		this.editor = editor;

		(editor.viewport as any).on('frame-end', this.onFrameEnd);
		editor.overlayContainer.addChild(this.container);
	}

	onRemoved(editor: Editor): void {
		(editor.viewport as any).off('frame-end', this.onFrameEnd);
		editor.overlayContainer.removeChild(this.container);
	}

	destroy(): void {
		this.container.destroy();
	}
}
