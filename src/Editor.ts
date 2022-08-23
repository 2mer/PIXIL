import EventEmitter from '@sgty/m-it';
import { Viewport } from 'pixi-viewport';
import {
	Application,
	Container,
	IApplicationOptions,
	InteractionEvent,
	SCALE_MODES,
	settings,
} from 'pixi.js';
import History from './History';
import Layer from './Layer';
import Overlay from './overlays/Overlay';
import Point from './Point';
import MouseTracker from './tools/MouseTracker';
import Tool from './tools/Tool';

export type EditorOptions = IApplicationOptions;
export type EditorEvent = { editor: Editor };
export type CanvasResizeEvent = EditorEvent & { width: number; height: number };

export default class Editor {
	app: Application;
	viewport: Viewport;
	layers: Layer[] = [];
	width = 0;
	height = 0;

	// overlays
	overlayContainer: Container;
	layerContainer: Container;
	underlayContainer: Container;
	overlays = [];

	// events
	public readonly onResize = new EventEmitter<CanvasResizeEvent>();

	focusedLayer: Layer;
	history;

	protected mouseTracker: MouseTracker;

	// override this incase you need anti-aliasing for some reason
	protected setupPixiSettings() {
		settings.SCALE_MODE = SCALE_MODES.NEAREST;
	}

	constructor({ ...rest }: EditorOptions) {
		this.setupPixiSettings();

		this.history = new History();

		this.app = new Application(rest);

		this.viewport = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldHeight: 0,
			worldWidth: 0,

			interaction: this.app.renderer.plugins.interaction,
		});

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

		this.mouseTracker = new MouseTracker(this);
		this.addTool(this.mouseTracker);
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

		this.viewport.clamp({
			left: -padding,
			top: -padding,
			bottom: height + padding,
			right: width + padding,
		});

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
		return layer;
	}

	removeLayer(layer: Layer): void {
		this.layers.splice(this.layers.indexOf(layer), 1);
		this.viewport.removeChild(layer.sprite);
	}

	setFocusedLayer(layer: Layer): void {
		this.focusedLayer = layer;
	}

	private addOverlayToContainer(overlay: Overlay, container: Container) {
		this.overlays.push(overlay);
		overlay.onAdded(this, container);
	}
	private removeOverlayFromContainer(overlay: Overlay, container: Container) {
		const index = this.overlays.indexOf(overlay);
		if (index !== -1) {
			this.overlays.splice(index, 1);
			overlay.onRemoved(this, container);
		}
	}

	addOverlay(overlay: Overlay) {
		this.addOverlayToContainer(overlay, this.overlayContainer);

		return this;
	}

	removeOverlay(overlay: Overlay) {
		this.removeOverlayFromContainer(overlay, this.overlayContainer);

		return this;
	}

	addUnderlay(overlay: Overlay) {
		this.addOverlayToContainer(overlay, this.underlayContainer);

		return this;
	}

	removeUnderlay(overlay: Overlay) {
		this.removeOverlayFromContainer(overlay, this.underlayContainer);

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

	destroy() {
		this.app.destroy();
		this.layers.forEach((layer) => layer.destroy());
		this.overlays.forEach((overlay) => overlay.destroy());

		// events
		this.onResize.clear();
	}
}
