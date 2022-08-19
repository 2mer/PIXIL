import { Sprite, Texture } from 'pixi.js';

export default class Layer {
	canvas: HTMLCanvasElement;
	texture: Texture;
	sprite: Sprite;
	ctx: CanvasRenderingContext2D;
	destroyed = false;
	readonly = false;
	width: number = 0;
	height: number = 0;

	constructor() {
		this.canvas = document.createElement('canvas');

		this.texture = Texture.from(this.canvas);
		this.ctx = this.canvas.getContext('2d');

		this.sprite = Sprite.from(this.texture);
	}

	resizeTo({ width, height }) {
		this.resize(width, height);
	}

	resize(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.canvas.width = width;
		this.canvas.height = height;

		this.sprite.width = width;
		this.sprite.height = height;
	}

	loadImage(image: HTMLImageElement) {
		return new Promise<void>((resolve, reject) => {
			const handleImageLoad = () => {
				this.resizeTo(image);
				this.ctx.drawImage(image, 0, 0);
				this.texture.update();

				// update sprite dimensions after texture update
				this.sprite.width = image.width;
				this.sprite.height = image.height;

				resolve();
			};

			if (image.complete) {
				handleImageLoad();
			} else {
				image.onload = handleImageLoad;
				image.onerror = reject;
			}
		});
	}

	destroy() {
		this.texture.destroy();
		this.canvas = null;
		this.destroyed = true;
	}

	static async fromUrl(url) {
		const img = new Image();
		img.src = url;

		return Layer.fromImage(img);
	}

	static async fromImage(image: HTMLImageElement) {
		const layer = new Layer();

		await layer.loadImage(image);

		return layer;
	}
}
