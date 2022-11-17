import Color from "color";
import FloodFill from "q-floodfill";
import Layer from "../../Layer";

export default function fillLayer(layer: Layer, x: number, y: number, color: Color, tolerance: number = 0) {

	layer.render(ctx => {
		const floodFill = new FloodFill(ctx.getImageData(0, 0, layer.width, layer.height));

		console.log(`rgba(${[color.red(), color.green(), color.blue(), color.alpha()].join(',')})`);

		floodFill.fill(`rgba(${[color.red(), color.green(), color.blue(), color.alpha()].join(',')})`, x, y, tolerance);

		ctx.putImageData(floodFill.imageData, 0, 0);
	})

}