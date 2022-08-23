import Point from '../Point';
import Brush from './Brush';

export default class Eraser extends Brush {
	public name = 'eraser';

	paintPosition(pos: Point) {
		const size = this.getSize();
		const startPos = pos.add(-size / 2, -size / 2).round();

		this.editor.focusedLayer.render((ctx) => {
			ctx.clearRect(startPos.x, startPos.y, size, size);
		});
	}
}
