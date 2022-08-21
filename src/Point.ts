import { Point as PixiPoint } from 'pixi.js';

export default class Point extends PixiPoint {
	add(x: number, y: number) {
		return new Point(this.x + x, this.y + y);
	}

	round() {
		return new Point(Math.round(this.x), Math.round(this.y));
	}
	floor() {
		return new Point(Math.floor(this.x), Math.floor(this.y));
	}
}
