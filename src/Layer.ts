import { Sprite, Texture } from 'pixi.js';

export default class Layer {
	canvas: HTMLCanvasElement;
	texture: Texture;
	sprite: Sprite;
	ctx: CanvasRenderingContext2D;
	destroyed = false;
	width: number = 0;
	height: number = 0;

	constructor({ width, height }) {
		this.canvas = document.createElement('canvas');

		this.texture = Texture.from(this.canvas);
		this.ctx = this.canvas.getContext('2d');

		this.sprite = Sprite.from(this.texture);
		this.resize(width, height);
	}

	resize(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.canvas.width = width;
		this.canvas.height = height;

		this.sprite.width = width;
		this.sprite.height = height;

		return this;
	}

	drawImage(image: HTMLImageElement, dx = 0, dy = 0) {
		this.ctx.drawImage(image, dx, dy);

		this.update();

		return this;
	}

	destroy() {
		this.texture.destroy();
		this.canvas = null;
		this.destroyed = true;
	}

	update() {
		this.texture.update();

		// update sprite dimensions after texture update
		this.sprite.width = this.width;
		this.sprite.height = this.height;

		return this;
	}

	// utility call that is chainable and calls update at the end
	render(renderCallback: (ctx: CanvasRenderingContext2D) => void) {
		renderCallback(this.ctx);

		this.update();

		return this;
	}
}
