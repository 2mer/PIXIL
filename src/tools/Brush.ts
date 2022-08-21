import { InteractionEvent, Sprite, Texture } from 'pixi.js';
import Editor from '../Editor';
import PluginPauser from '../util/PluginPauser';
import Tool from './Tool';

export default class Brush extends Tool {
	public name = 'brush';

	public color = 0;
	public alpha = 1;

	private pluginPauser: PluginPauser;

	private overlay: Sprite;

	constructor(editor: Editor, { pluginsToDisable = [] as string[] } = {}) {
		super(editor);

		this.pluginPauser = new PluginPauser(...pluginsToDisable);
		this.overlay = Sprite.from(Texture.WHITE);
		this.overlay.tint = 0;
		this.overlay.width = 1;
		this.overlay.height = 1;
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

	down(event: InteractionEvent): boolean {
		if (this.paused) return false;

		this.pluginPauser.pause(this.editor.viewport.plugins);

		return true;
	}

	up(event: InteractionEvent): boolean {
		if (this.paused) return false;

		this.pluginPauser.resume(this.editor.viewport.plugins);

		return true;
	}

	move(event: InteractionEvent): boolean {
		if (this.paused) return false;

		const mousePos = this.editor.toCanvas(event).floor();
		this.overlay.position.copyFrom(mousePos);
		this.overlay.tint = this.getColor();
		this.overlay.alpha = this.getAlpha();

		this.editor.viewport.pause = false;

		return true;
	}

	destroy(): void {
		this.overlay.destroy();
	}
}
