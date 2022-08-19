import { Viewport } from 'pixi-viewport';
import {
	Application,
	IApplicationOptions,
	SCALE_MODES,
	settings,
} from 'pixi.js';
import BackgroundRenderer, {
	BackgroundRendererOptions,
} from './BackgroundRenderer';
import Layer from './Layer';

export type ViewportInteractionSettings = {
	drag: boolean;
	pinch: boolean;
	wheel: boolean;
	decelerate: boolean;
};

export type EditorOptions = IApplicationOptions &
	BackgroundRendererOptions & {
		setInteractions?: (viewport: Viewport) => void;
	};

export default class Editor {
	app: Application;
	viewport: Viewport;
	layers: Layer[] = [];
	width = 0;
	height = 0;
	backgroundRenderer;

	constructor({
		checkerboard,
		border,
		setInteractions,
		...rest
	}: EditorOptions) {
		settings.SCALE_MODE = SCALE_MODES.NEAREST;

		this.app = new Application(rest);
		this.backgroundRenderer = new BackgroundRenderer({
			renderer: this.app.renderer as any,
			checkerboard: checkerboard,
			border: border,
		});

		this.viewport = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldHeight: 0,
			worldWidth: 0,

			interaction: this.app.renderer.plugins.interaction,
		});
		this.app.stage.addChild(this.viewport);

		this.addLayer = this.addLayer.bind(this);
		this.removeLayer = this.removeLayer.bind(this);
		this.resize = this.resize.bind(this);
		this.destroy = this.destroy.bind(this);

		setInteractions?.(this.viewport);

		this.viewport.addChild(this.backgroundRenderer);
	}

	resize(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.viewport.resize(
			this.app.view.width,
			this.app.view.height,
			width,
			height
		);

		this.backgroundRenderer.resize(width, height);

		const padding = Math.min(this.width, this.height) * 0.1;

		this.home(padding);

		this.viewport.clamp({
			left: -padding,
			top: -padding,
			bottom: height + padding,
			right: width + padding,
		});
	}

	home(padding = 0) {
		const pWidth = this.width + padding * 2;
		const pHeight = this.height + padding * 2;

		this.viewport
			.fit(false, pWidth, pHeight)
			.moveCenter(this.width / 2, this.height / 2);
	}

	addLayer(layer: Layer) {
		this.layers.push(layer);
		this.viewport.addChild(layer.sprite);

		if (layer.width > this.width || layer.height > this.height) {
			this.resize(layer.width, layer.height);
		}

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
