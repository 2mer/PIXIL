import EventEmitter from '@sgty/m-it';
import { Viewport } from 'pixi-viewport';
import {
	Application,
	Container,
	IApplicationOptions,
	InteractionEvent,
	SCALE_MODES,
	settings,
	Ticker,
} from 'pixi.js';
import Addon from './addon/Addon';
import History from './History';
import Layer from './Layer';
import Point from './Point';
import MouseTracker from './tools/MouseTracker';
import Tool from './tools/Tool';

export type EditorOptions = IApplicationOptions;
export type EditorEvent = { editor: Editor };
export type CanvasResizeEvent = EditorEvent & { width: number; height: number };

export default class Editor {
	app: Application;
	viewport: Viewport;
	ticker: Ticker;

	layers: Layer[] = [];
	width = 0;
	height = 0;

	// overlays
	overlayContainer: Container;
	layerContainer: Container;
	underlayContainer: Container;
	addons = [] as Addon[];

	// events
	public readonly onResize = new EventEmitter<CanvasResizeEvent>();
	public readonly onUpdate = new EventEmitter<number>();

	focusedLayer: Layer;
	history: History;

	protected mouseTracker: MouseTracker;

	// override this incase you need anti-aliasing for some reason
	protected setupPixiSettings() {
		settings.SCALE_MODE = SCALE_MODES.NEAREST;
	}

	constructor({ ...rest }: EditorOptions) {
		this.setupPixiSettings();

		this.history = new History();

		this.app = new Application(rest);
		this.ticker = new Ticker();
		this.ticker.start();

		this.viewport = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldHeight: 0,
			worldWidth: 0,

			passiveWheel: false,
			stopPropagation: true,

			interaction: this.app.renderer.plugins.interaction,
			divWheel: this.app.view,
		});

		// patch pointerInteractionEvent until fixed
		if (!(this.viewport as any).trackedPointers) {
			(this.viewport as any).trackedPointers = [];
		}

		this.app.stage.addChild(this.viewport);

		// overlay layers
		this.overlayContainer = new Container();
		this.layerContainer = new Container();
		this.underlayContainer = new Container();

		this.viewport.addChild(this.underlayContainer);
		this.viewport.addChild(this.layerContainer);
		this.viewport.addChild(this.overlayContainer);

		// bind methods
		this.createLayer = this.createLayer.bind(this);
		this.removeLayer = this.removeLayer.bind(this);
		this.setCanvasSize = this.setCanvasSize.bind(this);
		this.destroy = this.destroy.bind(this);
		this.goHome = this.goHome.bind(this);
		this.update = this.update.bind(this);

		this.mouseTracker = new MouseTracker(this);
		this.addTool(this.mouseTracker);

		this.ticker.add(this.update);
	}

	update() {
		this.onUpdate.emit(this.ticker.elapsedMS);
	}

	get mousePosition() {
		return this.mouseTracker.position;
	}

	get globalMousePosition() {
		return this.mouseTracker.globalPosition;
	}

	setCanvasSize(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.viewport.resize(
			this.app.view.width,
			this.app.view.height,
			width,
			height
		);

		const padding = Math.min(this.width, this.height) * 0.1;

		this.goHome(padding);

		this.onResize.emit({ editor: this, width, height });

		return this;
	}

	goHome(padding = 0) {
		const pWidth = this.width + padding * 2;
		const pHeight = this.height + padding * 2;

		this.viewport
			.fit(false, pWidth, pHeight)
			.moveCenter(this.width / 2, this.height / 2);

		return this;
	}

	getLayers() {
		return this.layers;
	}

	createLayer(): Layer {
		const layer = new Layer({ width: this.width, height: this.height });
		layer.resize(this.width, this.height);
		this.layerContainer.addChild(layer.sprite);
		this.layers.push(layer);
		return layer;
	}

	removeLayer(layer: Layer): void {
		this.layers.splice(this.layers.indexOf(layer), 1);
		this.viewport.removeChild(layer.sprite);
	}

	setFocusedLayer(layer: Layer): void {
		this.focusedLayer = layer;
	}

	addAddon(addon: Addon) {
		this.addons.push(addon);
		addon.editor = this;
		addon.onAdded(this);

		return this;
	}

	removeAddon(addon: Addon) {
		const index = this.addons.indexOf(addon);
		if (index !== -1) {
			this.addons.splice(index, 1);
			addon.onRemoved(this);
			addon.editor = null;
		}

		return this;
	}

	// see `pixi-viewport` PluginManager for more info on the ordering
	addTool(tool: Tool, index = 0) {
		this.viewport.plugins.add(tool.name, tool, index);
		tool.onAdded();
	}

	pauseTool(tool: Tool) {
		tool.pause();
	}

	resumeTool(tool: Tool) {
		tool.resume();
	}

	removeTool(tool: Tool) {
		this.viewport.plugins.remove(tool.name);
		tool.onRemoved();
	}

	// convert global interaction event coords to local canvas coords
	toCanvas(event: InteractionEvent) {
		return new Point().copyFrom(this.viewport.toWorld(event.data.global));
	}

	// capture image data from specified layers - drawn into given canvas
	capture(
		canvas: HTMLCanvasElement,
		x = 0,
		y = 0,
		width = this.width,
		height = this.height,
		layers: Layer[] = this.layers
	) {
		const ctx = canvas.getContext('2d');
		canvas.width = width;
		canvas.height = height;

		ctx.clearRect(0, 0, width, height);

		layers.forEach((layer) => {
			ctx.drawImage(
				layer.canvas,
				x,
				y,
				width,
				height,
				0,
				0,
				width,
				height
			);
		});
	}

	destroy() {
		this.app.destroy();
		this.layers.forEach((layer) => layer.destroy());
		this.addons.forEach((addon) => addon.destroy());

		// events
		this.onResize.clear();
		this.onUpdate.clear();

		this.app.ticker.remove(this.update);
	}
}
