import { Container } from 'pixi.js';
import Editor from '../Editor';

export default class Overlay {
	onAdded(editor: Editor, container: Container) {}
	onRemoved(editor: Editor, container: Container) {}
	destroy() {}
}
