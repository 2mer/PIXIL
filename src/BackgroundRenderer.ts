import { Container, Graphics, Renderer, TilingSprite } from 'pixi.js';
import createCheckerboardTexture from './createCheckerboardTexture';

export type BackgroundRendererOptions = {
	checkerboard?: { c1: number; c2: number };
	border?: { width: number; color: number };
};

export default class BackgroundRenderer extends Container {
	checkerboardSprite: TilingSprite;
	borderGraphics: Graphics;

	checkerboard;
	border;

	constructor({
		checkerboard,
		border,
		renderer,
	}: BackgroundRendererOptions & { renderer: Renderer }) {
		super();

		if (checkerboard) {
			const { c1, c2 } = checkerboard;
			const cTex = createCheckerboardTexture(renderer, c1, c2);
			this.checkerboardSprite = TilingSprite.from(cTex, {
				width: 0,
				height: 0,
			});
			this.checkerboard = checkerboard;
			this.addChild(this.checkerboardSprite);
		}

		if (border) {
			this.borderGraphics = new Graphics();
			this.border = border;
			this.addChild(this.borderGraphics);
		}
	}

	resize(width: number, height: number) {
		if (this.checkerboardSprite) {
			this.checkerboardSprite.width = width;
			this.checkerboardSprite.height = height;
		}

		if (this.borderGraphics) {
			const lineWidth = this.border.width;

			this.borderGraphics.clear();
			this.borderGraphics.lineStyle({
				width: lineWidth,
				color: this.border.color,
			});
			this.borderGraphics.drawRect(
				-lineWidth / 2,
				-lineWidth / 2,
				width + lineWidth,
				height + lineWidth
			);
		}
	}

	destroy() {
		super.destroy();
		if (this.checkerboardSprite) {
			this.checkerboardSprite.destroy();
		}
		if (this.borderGraphics) {
			this.borderGraphics.destroy();
		}
	}
}
