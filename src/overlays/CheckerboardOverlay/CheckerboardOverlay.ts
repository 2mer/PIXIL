import { Container, RenderTexture, TilingSprite } from 'pixi.js';
import createCheckerboardTexture from './createCheckerboardTexture';
import Overlay from '../Overlay';
import { Editor } from '../..';
import { CanvasResizeEvent } from '../../Editor';

export type CheckerboardOverlayOptions = { c1: number; c2: number };

export default class CheckerboardOverlay extends Overlay {
	c1 = 0;
	c2 = 0xffffff;

	checkerboardTexture: RenderTexture;
	checkerboardSprite: TilingSprite;

	constructor({ c1, c2 }: CheckerboardOverlayOptions) {
		super();
		this.c1 = c1;
		this.c2 = c2;

		this.onResize = this.onResize.bind(this);
	}

	private loaded = false;

	private loadTexture(renderer: any) {
		this.checkerboardTexture = createCheckerboardTexture(
			renderer,
			this.c1,
			this.c2
		);

		this.checkerboardSprite = TilingSprite.from(this.checkerboardTexture, {
			width: 0,
			height: 0,
		});
	}

	onAdded(editor: Editor, container: Container): void {
		if (!this.loaded) this.loadTexture(editor.app.renderer);

		editor.onResize.sub(this.onResize);
		container.addChild(this.checkerboardSprite, this.checkerboardSprite);
	}

	onRemoved(editor: Editor, container: Container): void {
		editor.onResize.unsub(this.onResize);
		container.removeChild(this.checkerboardSprite);
	}

	onResize({ width, height }: CanvasResizeEvent): void {
		this.checkerboardSprite.width = width;
		this.checkerboardSprite.height = height;
	}

	destroy() {
		super.destroy();

		this.checkerboardSprite.destroy();
		this.checkerboardTexture.destroy();
	}
}
