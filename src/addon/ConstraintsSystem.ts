import { Editor } from "..";
import Addon from "./Addon";

export interface IConstraintsSystemOptions {
	maxZoom?: number;
	minZoom?: number;
}

export default class ConstraintsSystem extends Addon {

	options: IConstraintsSystemOptions;

	constructor(options: IConstraintsSystemOptions = {}) {
		super()

		this.options = options;

		this.onFrameEnd = this.onFrameEnd.bind(this);
	}

	onFrameEnd() {
		// constrain movement
		const center = this.editor.viewport.center;

		let changed = false;
		const newCenter = { x : center.x , y : center.y };

		if (center.x < 0) {newCenter.x = 0; changed = true}
		if (center.y < 0) {newCenter.y = 0; changed = true}
		if (center.x > this.editor.width) {newCenter.x = this.editor.width; changed = true}
		if (center.y > this.editor.height) {newCenter.y = this.editor.height; changed = true}

		if (changed) {
			this.editor.viewport.moveCenter(newCenter.x, newCenter.y)
		}

		// constrain zoom
		const zoom = this.editor.viewport.scale.x;
		if (!isNaN(this.options.maxZoom) && (zoom > this.options.maxZoom)) this.editor.viewport.setZoom(this.options.maxZoom, true);
		if (!isNaN(this.options.minZoom) && (zoom < this.options.minZoom)) this.editor.viewport.setZoom(this.options.minZoom, true);
	}

	onAdded(editor: Editor): void {
		(editor.viewport as any).on('frame-end', this.onFrameEnd);
	}
	
	onRemoved(editor: Editor): void {
		(editor.viewport as any).off('frame-end', this.onFrameEnd);
	}
}