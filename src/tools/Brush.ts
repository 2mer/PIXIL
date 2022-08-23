import * as Color from 'color';
import { InteractionEvent, Sprite, Texture } from 'pixi.js';
import Editor from '../Editor';
import Point from '../Point';
import PluginPauser from '../util/PluginPauser';
import Tool from './Tool';

export default class Brush extends Tool {
	public name = 'brush';

	public color = new Color(0);
	public alpha = 1;
	public size = 4;

	protected pluginPauser: PluginPauser;

	protected overlay: Sprite;
	protected buttons;
	protected pressed = false;

	constructor(
		editor: Editor,
		{ pluginsToDisable = [] as string[], buttons = [] as number[] } = {}
	) {
		super(editor);

		this.pluginPauser = new PluginPauser(...pluginsToDisable);
		this.overlay = Sprite.from(Texture.WHITE);
		this.overlay.tint = 0;
		this.overlay.width = 1;
		this.overlay.height = 1;
		this.buttons = buttons;
	}

	onAdded() {
		this.editor.overlayContainer.addChild(this.overlay);
	}
	onRemoved() {
		this.editor.overlayContainer.removeChild(this.overlay);
	}

	getColor() {
		return this.color;
	}

	getAlpha() {
		return this.alpha;
	}

	getSize() {
		return this.size * 2 - 1;
	}

	paintPosition(pos: Point) {
		const size = this.getSize();
		const startPos = pos.add(-size / 2, -size / 2).round();

		this.editor.focusedLayer.render((ctx) => {
			ctx.fillStyle = this.getColor().hex();
			ctx.globalAlpha = this.getAlpha();
			ctx.fillRect(startPos.x, startPos.y, size, size);
		});
	}

	down(event: InteractionEvent): boolean {
		if (this.paused) return false;
		if (!this.buttons.includes(event.data.button)) return false;

		this.pressed = true;

		this.pluginPauser.pause(this.editor.viewport.plugins);

		if (this.editor.focusedLayer) {
			const mousePos = this.editor.toCanvas(event).floor();
			this.paintPosition(mousePos);
		}

		return true;
	}

	up(event: InteractionEvent): boolean {
		if (this.paused) return false;
		if (!this.buttons.includes(event.data.button)) return false;

		this.pressed = false;

		this.pluginPauser.resume(this.editor.viewport.plugins);

		return true;
	}

	move(event: InteractionEvent): boolean {
		if (this.paused) return false;

		const mousePos = this.editor.toCanvas(event).floor();
		this.overlay.tint = this.getColor().rgbNumber();
		this.overlay.alpha = this.getAlpha();

		const size = this.getSize();
		this.overlay.position.copyFrom(
			mousePos.add(-size / 2, -size / 2).round()
		);
		this.overlay.width = size;
		this.overlay.height = size;

		if (!this.pressed) return false;

		this.paintPosition(mousePos);

		return true;
	}

	destroy(): void {
		this.overlay.destroy();
	}
}
