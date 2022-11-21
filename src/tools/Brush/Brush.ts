import Color from 'color';
import { InteractionEvent } from 'pixi.js';
import Editor from '../../Editor';
import Cursor from '../../addon/overlays/Cursor';
import Point from '../../Point';
import PluginPauser from '../../util/PluginPauser';
import Tool from '../Tool';
import BrushCursor from './BrushCursor';
import LayerDeltaPacker from '../../util/LayerDeltaPacker';

export default class Brush extends Tool {
	public name = 'brush';

	public color;
	public size;

	protected pluginPauser: PluginPauser;

	protected cursor: Cursor;
	protected buttons;
	protected pressed = false;
	protected prevPos = null as Point;
	protected layerDeltaPacker: LayerDeltaPacker;

	constructor(
		editor: Editor,
		{ pluginsToDisable = [] as string[], buttons = [] as number[], color = Color(0), size = 4 } = {}
	) {
		super(editor);

		this.pluginPauser = new PluginPauser(...pluginsToDisable);
		this.cursor = this.createCursor();
		this.buttons = buttons;
		this.layerDeltaPacker = new LayerDeltaPacker();
		this.color = color;
		this.size = size;
	}

	createCursor(): Cursor {
		return new BrushCursor({ brush: this });
	}

	onAdded() {
		this.editor.addAddon(this.cursor);
	}
	onRemoved() {
		this.editor.removeAddon(this.cursor);
	}

	getColor() {
		return this.color;
	}

	getSize() {
		return this.size * 2 - 1;
	}

	paintPosition(pos: Point) {
		const size = this.getSize();
		const startPos = pos.add(-size / 2, -size / 2).round();

		this.editor.focusedLayer.render((ctx) => {
			ctx.fillStyle = this.getColor().hex();
			ctx.globalAlpha = this.color.alpha();
			ctx.fillRect(startPos.x, startPos.y, size, size);
		});
	}

	paintPositions(pos: Point) {
		if (this.prevPos) {
			const dist = this.prevPos.distance(pos);
			const angle = this.prevPos.angleFrom(pos);
			const size = this.getSize();
			const halfSize = size / 2;

			for (let i = 0; i < dist; i += halfSize) {
				const x = this.prevPos.x + Math.sin(angle) * i;
				const y = this.prevPos.y + Math.cos(angle) * i;

				this.paintPosition(new Point(x, y).floor());
			}
		} else {
			this.paintPosition(pos);
		}
	}

	down(event: InteractionEvent): boolean {
		if (this.paused) return false;
		if (!this.buttons.includes(event.data.button)) return false;

		this.pressed = true;

		this.pluginPauser.pause(this.editor.viewport.plugins);

		if (this.editor.focusedLayer) {
			if (this.editor.history.enabled) {
				// start delta
				this.layerDeltaPacker.begin(this.editor.focusedLayer);
			}

			const mousePos = this.editor.toCanvas(event).floor();
			this.paintPosition(mousePos);
			this.prevPos = mousePos;
		}

		return true;
	}

	up(event: InteractionEvent): boolean {
		if (this.paused) return false;
		if (!this.buttons.includes(event.data.button)) return false;

		this.pressed = false;
		this.prevPos = null;

		this.pluginPauser.resume(this.editor.viewport.plugins);

		if (this.editor.history.enabled) {
			// end delta
			if (this.layerDeltaPacker.startData) {
				this.editor.history.add({
					identifier: this.name,
					target: this.editor.focusedLayer,
					delta: this.layerDeltaPacker.end(this.editor.focusedLayer),
				});
			}
		} else {
			this.layerDeltaPacker.clear();
		}

		return true;
	}

	move(event: InteractionEvent): boolean {
		if (this.paused) return false;

		const mousePos = this.editor.toCanvas(event).floor();

		if (!this.pressed) return false;

		this.paintPositions(mousePos);
		this.prevPos = mousePos;

		return true;
	}

	destroy(): void {
		this.cursor.destroy();
	}
}
