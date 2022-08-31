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
	ceil() {
		return new Point(Math.ceil(this.x), Math.ceil(this.y));
	}
	distance(other: Point) {
		return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2))
	}
	angleFrom(other: Point) {
		return Math.atan2(other.x - this.x, other.y - this.y)
	}
}
