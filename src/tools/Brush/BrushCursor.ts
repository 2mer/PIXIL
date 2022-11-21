import { Sprite, Texture } from 'pixi.js';
import Cursor from '../../addon/overlays/Cursor';
import Brush from './Brush';

export default class BrushCursor extends Cursor {
	protected brush: Brush;
	protected sprite: Sprite;

	constructor({ brush }: { brush: Brush }) {
		super({ world: true });
		this.brush = brush;

		this.sprite = Sprite.from(Texture.WHITE);
		this.sprite.tint = 0;
		this.sprite.width = 1;
		this.sprite.height = 1;

		this.sprite.anchor.set(0.5, 0.5);
		this.sprite.position.set(0, 0);

		this.container.addChild(this.sprite);
	}

	onFrameEnd(delta: number): void {
		super.onFrameEnd(delta);

		const size = this.brush.getSize();
		const roundSize = (size / 2) % 1;

		this.container.position.x += roundSize;
		this.container.position.y += roundSize;

		this.sprite.tint = this.brush.getColor().rgbNumber();
		this.sprite.alpha = this.brush.getColor().alpha();
		this.sprite.width = size;
		this.sprite.height = size;
	}
}
