import { Application, IApplicationOptions } from 'pixi.js';

export default class Editor {
	app: Application;

	constructor(options: IApplicationOptions) {
		this.app = new Application(options);
	}
}
