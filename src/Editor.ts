import { Viewport } from 'pixi-viewport';
import { Application, IApplicationOptions } from 'pixi.js';
import Layer from './Layer';

export type EditorOptions = IApplicationOptions;

export default class Editor {
	app: Application;
	viewport: Viewport;
	layers: Layer[] = [];

	constructor(options: EditorOptions) {
		this.app = new Application(options);
		this.viewport = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldWidth: 1000,
			worldHeight: 1000,

			interaction: this.app.renderer.plugins.interaction,
		});
		this.app.stage.addChild(this.viewport);

		this.viewport.drag().pinch().wheel().decelerate();
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
