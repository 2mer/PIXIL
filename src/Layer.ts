import Color from 'color';
import { Sprite, Texture } from 'pixi.js';
import { IHistoryTarget } from './History';

export default class Layer implements IHistoryTarget {
	canvas: HTMLCanvasElement;
	texture: Texture;
	sprite: Sprite;
	ctx: CanvasRenderingContext2D;
	destroyed = false;
	width: number = 0;
	height: number = 0;
	name: string = 'New Layer';

	constructor({ width, height }) {
		this.canvas = document.createElement('canvas');

		this.texture = Texture.from(this.canvas);
		this.ctx = this.canvas.getContext('2d');

		this.sprite = Sprite.from(this.texture);
		this.resize(width, height);
	}

	addImageData(data, dx, dy, subtract = false) {
		const imageData = this.ctx.getImageData(
			dx,
			dy,
			data.width,
			data.height
		);

		for (let j = 0; j < data.height; j++) {
			for (let i = 0; i < data.width; i++) {
				const index = (i + j * data.width) * 4;

				if (subtract) {
					imageData.data[index + 0] -= data.data[index + 0];
					imageData.data[index + 1] -= data.data[index + 1];
					imageData.data[index + 2] -= data.data[index + 2];
					imageData.data[index + 3] -= data.data[index + 3];
				} else {
					imageData.data[index + 0] += data.data[index + 0];
					imageData.data[index + 1] += data.data[index + 1];
					imageData.data[index + 2] += data.data[index + 2];
					imageData.data[index + 3] += data.data[index + 3];
				}
			}
		}

		this.ctx.putImageData(imageData, dx, dy);
		this.update();
	}

	undo(delta: any) {
		this.addImageData(delta, delta.dx, delta.dy, true);
	}
	redo(delta: any) {
		this.addImageData(delta, delta.dx, delta.dy);
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

	// not optimized for mass calls, instead use ctx#getImageData
	getPixelColor(x: number, y: number) {
		const clr = this.ctx.getImageData(x, y, 1, 1).data;

		return new Color({
			red: clr[0],
			green: clr[1],
			blue: clr[2],
			alpha: clr[3],
		});
	}
}
