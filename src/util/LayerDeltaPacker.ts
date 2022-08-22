import Layer from '../Layer';

export default class LayerDeltaPacker {
	startData: ImageData;

	begin(layer: Layer) {
		this.startData = layer.ctx.getImageData(
			0,
			0,
			layer.width,
			layer.height
		);
	}

	end(layer: Layer) {
		const endData = layer.ctx.getImageData(0, 0, layer.width, layer.height);

		const delta = layer.ctx.createImageData(layer.width, layer.height);

		for (let i = 0; i < endData.data.length; i += 4) {
			const sr = this.startData.data[i];
			const sg = this.startData.data[i + 1];
			const sb = this.startData.data[i + 2];
			const sa = this.startData.data[i + 3];

			const er = endData.data[i];
			const eg = endData.data[i + 1];
			const eb = endData.data[i + 2];
			const ea = endData.data[i + 3];

			endData.data[i] = er - sr;
			endData.data[i + 1] = eg - sg;
			endData.data[i + 2] = eb - sb;
			endData.data[i + 3] = ea - sa;
		}

		return { dx: 0, dy: 0, data: delta };
	}

	clear() {
		this.startData = undefined;
	}
}
