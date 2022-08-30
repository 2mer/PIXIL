import { Sprite, Texture } from 'pixi.js';
import Cursor from '../../addon/overlays/Cursor';
import Eraser from './Eraser';

export default class EraserCursor extends Cursor {
	protected eraser: Eraser;
	protected spriteBlack: Sprite;
	protected spriteWhite: Sprite;

	constructor({ eraser }: { eraser: Eraser }) {
		super({ world: true });
		this.eraser = eraser;

		this.spriteBlack = Sprite.from(Texture.WHITE);
		this.spriteBlack.tint = 0;
		this.spriteBlack.width = 1;
		this.spriteBlack.height = 1;

		this.spriteBlack.anchor.set(0.5, 0.5);
		this.spriteBlack.position.set(0, 0);

		this.spriteWhite = Sprite.from(Texture.WHITE);
		this.spriteWhite.width = 1;
		this.spriteWhite.height = 1;

		this.spriteWhite.anchor.set(0.5, 0.5);
		this.spriteWhite.position.set(0, 0);

		this.container.addChild(this.spriteBlack);
		this.container.addChild(this.spriteWhite);
	}

	onUpdate(delta: number): void {
		super.onUpdate(delta);

		const size = this.eraser.getSize();
		const roundSize = (size / 2) % 1;

		this.container.position.x += roundSize;
		this.container.position.y += roundSize;

		this.spriteBlack.width = size;
		this.spriteBlack.height = size;

		this.spriteWhite.width = size - 1;
		this.spriteWhite.height = size - 1;
	}
}
