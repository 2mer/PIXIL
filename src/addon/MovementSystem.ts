import { Editor } from '..';
import Addon from './Addon';

function Vector2D(x, y) {
	this.x = x;
	this.y = y;

	this.mag = () => Math.sqrt(this.x ** 2 + this.y ** 2);

	this.add = (dx, dy = dx) => {
		this.x += dx;
		this.y += dy;
	}

	this.mul = (mx, my = mx) => {
		this.x *= mx;
		this.y *= my;
	}

	this.normalize = () => {
		const l = this.mag();

		return new Vector2D(this.x / l, this.y / l);
	}

	this.clone = () => {
		return new Vector2D(this.x, this.y);
	}
}

export interface IMovementSystemOptions {
	speed?: number;
	drag?: number;
	maxSpeed?: number;
	minSpeed?: number;
	zoomSpeed?: number;
	zoomTapAmt?: number;
}

const DEFAULT_MOVEMENT_SYSTEM_OPTIONS = { speed : 2600, drag : 0.9, maxSpeed : 100, minSpeed : 1, zoomSpeed : 2600, zoomTapAmt : 0 }

type keyBindingKeys = "left" | "right" | "down" | "up" | "zoomIn" | "zoomOut";

export default class MovementSystem extends Addon {

	options: IMovementSystemOptions;

	keyStatus = {
		left: false,
		right: false,
		down: false,
		up: false,
		zoomIn: false,
		zoomOut: false,
	}

	keyBindings = {
		left: [],
		right: [],
		down: [],
		up: [],
		zoomIn: [],
		zoomOut: [],
	}

	currentSpeed = new Vector2D(0, 0);

	constructor(options: IMovementSystemOptions = DEFAULT_MOVEMENT_SYSTEM_OPTIONS) {
		super();
		this.options = options;

		this.tick = this.tick.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	onAdded(editor: Editor): void {
		editor.app.ticker.add(this.tick);

		editor.app.view.addEventListener('blur', this.handleBlur);
		editor.app.view.addEventListener('keydown', this.handleKeyDown);
		editor.app.view.addEventListener('keyup', this.handleKeyUp);

		this.editor.app.view.setAttribute("tabindex", "0")
	}
	
	onRemoved(editor: Editor): void {
		editor.app.ticker.remove(this.tick);

		editor.app.view.removeEventListener('blur', this.handleBlur);
		editor.app.view.removeEventListener('keydown', this.handleKeyDown);
		editor.app.view.removeEventListener('keyup', this.handleKeyUp);
	}

	wasd() {
		this.keyBindings.up.push('w');
		this.keyBindings.left.push('a');
		this.keyBindings.down.push('s');
		this.keyBindings.right.push('d');

		return this;
	}

	plusminus() {
		this.keyBindings.zoomIn.push('=', "+");
		this.keyBindings.zoomOut.push('-');

		return this;
	}

	arrows() {
		this.keyBindings.up.push('ArrowUp');
		this.keyBindings.left.push('ArrowLeft');
		this.keyBindings.down.push('ArrowDown');
		this.keyBindings.right.push('ArrowRight');

		return this;
	}

	keys(keys: { [key in keyBindingKeys]?: string | string[] }) {
		const asArray = (o) => Array.isArray(o) ? o : [o];

		Object.entries(keys).forEach(([key, value]) => {
			this.keyBindings[key].push(...asArray(value))
		})

		return this;
	}

	clearKeys() {
		this.keyBindings.up.length = 0;
		this.keyBindings.left.length = 0;
		this.keyBindings.down.length = 0;
		this.keyBindings.right.length = 0;
		this.keyBindings.zoomIn.length = 0;
		this.keyBindings.zoomOut.length = 0;
	}

	handleKeyDown(e) {
		console.log('yooo', e)
		if (e.target === this.editor.app.view) {
			if (this.keyBindings.left.includes(e.key)) {
				this.keyStatus.left = true;
				e.preventDefault();
			} else if (this.keyBindings.right.includes(e.key)) {
				this.keyStatus.right = true;
				e.preventDefault();
			} else if (this.keyBindings.up.includes(e.key)) {
				this.keyStatus.up = true;
				e.preventDefault();
			} else if (this.keyBindings.down.includes(e.key)) {
				this.keyStatus.down = true;
				e.preventDefault();
			} else if (this.keyBindings.zoomIn.includes(e.key)) {
				// zoom tap
				if (!this.keyStatus.zoomIn) {
					this.editor.viewport.zoom(this.options.zoomTapAmt)
				}
				this.keyStatus.zoomIn = true;
				e.preventDefault();
			} else if (this.keyBindings.zoomOut.includes(e.key)) {
				// zoom tap
				if (!this.keyStatus.zoomOut) {
					this.editor.viewport.zoom(-this.options.zoomTapAmt)
				}
				this.keyStatus.zoomOut = true;
				e.preventDefault();
			}
		}
	}

	handleKeyUp(e) {

		if (e.target === this.editor.app.view) {
			Object.entries(this.keyBindings).forEach(([key, value]) => {
				if (value.includes(e.key)) {
					this.keyStatus[key] = false;
				}
			})
		}

	}

	handleBlur(e) {
		this.keyStatus.left = false;
		this.keyStatus.right = false;
		this.keyStatus.down = false;
		this.keyStatus.up = false;
		this.keyStatus.zoomIn = false;
		this.keyStatus.zoomOut = false;
	}

	tick(delta) {

		const deltaSeconds = delta / 1000;

		const movementDirection = new Vector2D(0, 0);

		if (this.keyStatus.left) {
			movementDirection.x -= 1;
		}
		if (this.keyStatus.right) {
			movementDirection.x += 1;
		}
		if (this.keyStatus.up) {
			movementDirection.y -= 1;
		}
		if (this.keyStatus.down) {
			movementDirection.y += 1;
		}

		if (movementDirection.mag() > 0) {

			const nDir = movementDirection.normalize();
			const speed = this.getSpeed();

			this.currentSpeed.add(nDir.x * speed * deltaSeconds, nDir.y * speed * deltaSeconds);
		}

		const maxSpeed = this.getMaxSpeed()

		if (this.currentSpeed.mag() >= maxSpeed) {
			this.currentSpeed.mul(this.options.drag);

			this.editor.viewport.x -= this.currentSpeed.x;
			this.editor.viewport.y -= this.currentSpeed.y;
		}

		const zoomDir = this.keyStatus.zoomIn ? 1 : this.keyStatus.zoomOut ? -1 : 0
		const zoomBy = this.options.zoomSpeed * deltaSeconds * zoomDir;

		if (zoomBy) {
			this.editor.viewport.zoom(zoomBy, true);
		}
	}

	getSpeed() {
		return this.options.speed
	}

	getMaxSpeed() {
		return this.options.minSpeed
	}
}