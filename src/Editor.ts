import { Viewport } from 'pixi-viewport';
import {
	Application,
	IApplicationOptions,
	SCALE_MODES,
	settings,
} from 'pixi.js';
import Layer from './Layer';

export type ViewportInteractionSettings = {
	drag: boolean;
	pinch: boolean;
	wheel: boolean;
	decelerate: boolean;
};

export type EditorOptions = IApplicationOptions & {
	interactions: ViewportInteractionSettings;
};

export default class Editor {
	app: Application;
	viewport: Viewport;
	layers: Layer[] = [];

	constructor(options: EditorOptions) {
		settings.SCALE_MODE = SCALE_MODES.NEAREST;

		const { interactions } = options;

		this.app = new Application(options);
		this.viewport = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldWidth: 1000,
			worldHeight: 1000,

			interaction: this.app.renderer.plugins.interaction,
		});
		this.app.stage.addChild(this.viewport);

		const {
			drag = true,
			pinch = true,
			wheel = true,
			decelerate = false,
		} = interactions || {};

		if (drag) {
			this.viewport.drag();
		}
		if (pinch) {
			this.viewport.pinch();
		}
		if (wheel) {
			this.viewport.wheel();
		}
		if (decelerate) {
			this.viewport.decelerate();
		}
	}

	addLayer(layer: Layer) {
		this.layers.push(layer);
		this.viewport.addChild(layer.sprite);

		return () => {
			this.removeLayer(layer);
		};
	}

	removeLayer(layer: Layer): void {
		this.layers.splice(this.layers.indexOf(layer), 1);
		this.viewport.removeChild(layer.sprite);
	}

	destroy() {
		this.app.destroy();
		this.layers.forEach((layer) => layer.destroy());
	}
}
