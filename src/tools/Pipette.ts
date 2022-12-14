import EventEmitter from '@sgty/m-it';
import Color from 'color';
import { InteractionEvent } from 'pixi.js';
import Editor from '../Editor';
import Point from '../Point';
import Tool from './Tool';

export default class Pipette extends Tool {
	public name = 'pipette';

	public readonly onPick = new EventEmitter<Color>();

	currentLayerOnly;

	constructor(editor: Editor, { currentLayerOnly = false } = {}) {
		super(editor);
		this.currentLayerOnly = currentLayerOnly;
	}

	pickColor(pos: Point) {
		if (this.currentLayerOnly) {
			this.onPick.emit(
				this.editor.focusedLayer.getPixelColor(pos.x, pos.y)
			);
		} else {
			let clr = new Color({ r: 0, g: 0, b: 0 }).alpha(0);

			[...this.editor.layers].reverse().some((layer) => {
				clr = layer.getPixelColor(pos.x, pos.y);
				return Boolean(clr.a);
			});

			this.onPick.emit(clr);
		}
	}

	down(event: InteractionEvent): boolean {
		if (this.paused) return false;

		const mousePos = this.editor.toCanvas(event).floor();
		this.pickColor(mousePos);

		return true;
	}

	up(event: InteractionEvent): boolean {
		if (this.paused) return false;

		const mousePos = this.editor.toCanvas(event).floor();
		this.pickColor(mousePos);

		return true;
	}

	move(event: InteractionEvent): boolean {
		if (this.paused) return false;

		const mousePos = this.editor.toCanvas(event).floor();
		this.pickColor(mousePos);

		return true;
	}

	destroy(): void {
		this.onPick.clear();
	}
}
