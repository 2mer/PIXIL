import { Container, Graphics } from 'pixi.js';
import Editor, { CanvasResizeEvent } from '../Editor';
import Overlay from './Overlay';

export type OutlineOverlayOptions = { width: number; color: number };

export default class OutlineOverlay extends Overlay {
	borderGraphics: Graphics;
	width: number;
	color: number;

	constructor({ width, color }: OutlineOverlayOptions) {
		super();

		this.borderGraphics = new Graphics();
		this.width = width;
		this.color = color;

		this.onResize = this.onResize.bind(this);
	}

	onAdded(editor: Editor, container: Container) {
		editor.onResize.sub(this.onResize);
		container.addChild(this.borderGraphics);
	}

	onRemoved(editor: Editor, container: Container) {
		editor.onResize.unsub(this.onResize);
		container.removeChild(this.borderGraphics);
	}

	onResize({ width, height }: CanvasResizeEvent): void {
		const lineWidth = this.width;

		this.borderGraphics.clear();
		this.borderGraphics.lineStyle({
			width: lineWidth,
			color: this.color,
		});
		this.borderGraphics.drawRect(
			-lineWidth / 2,
			-lineWidth / 2,
			width + lineWidth,
			height + lineWidth
		);
	}

	destroy() {
		super.destroy();
	}
}
