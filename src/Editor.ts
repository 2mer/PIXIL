import { Application, IApplicationOptions } from 'pixi.js';

export type EditorOptions = IApplicationOptions;

export default class Editor {
	app: Application;

	constructor(options: EditorOptions) {
		this.app = new Application(options);
	}
}
