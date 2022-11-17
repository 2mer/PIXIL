import Color from 'color';
import { InteractionEvent } from 'pixi.js';
import Editor from '../../Editor';
import LayerDeltaPacker from '../../util/LayerDeltaPacker';
import PluginPauser from '../../util/PluginPauser';
import Tool from '../Tool';
import floodFill from './floodFill';

export default class Fill extends Tool {
	public name = 'fill';

	public color = new Color(0);
	public size = 4;
	public tolerance = 0;

	protected pluginPauser: PluginPauser;

	protected buttons;
	protected pressed = false;
	protected layerDeltaPacker: LayerDeltaPacker;

	constructor(
		editor: Editor,
		{ pluginsToDisable = [] as string[], buttons = [] as number[] } = {}
	) {
		super(editor);

		this.pluginPauser = new PluginPauser(...pluginsToDisable);
		this.buttons = buttons;
		this.layerDeltaPacker = new LayerDeltaPacker();
	}

	getColor() {
		return this.color;
	}

	getTolerance() {
		return this.tolerance
	}

	down(event: InteractionEvent): boolean {
		if (this.paused) return false;
		if (!this.buttons.includes(event.data.button)) return false;

		this.pressed = true;

		this.pluginPauser.pause(this.editor.viewport.plugins);

		return true;
	}

	up(event: InteractionEvent): boolean {
		if (this.paused) return false;
		if (!this.buttons.includes(event.data.button)) return false;

		this.pluginPauser.resume(this.editor.viewport.plugins);

		if (this.editor.focusedLayer) {

			if (this.editor.history.enabled) {
				this.layerDeltaPacker.begin(this.editor.focusedLayer);
			}

			const mousePos = this.editor.toCanvas(event).floor();
			floodFill(this.editor.focusedLayer, mousePos.x, mousePos.y, this.getColor(), this.getTolerance());

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
		}


		return true;
	}

	destroy(): void {
	}
}
