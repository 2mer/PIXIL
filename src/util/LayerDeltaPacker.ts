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

		const delta = new Array(layer.width * layer.height * 4);

		for (let i = 0; i < endData.data.length; i += 4) {
			const sr = this.startData.data[i];
			const sg = this.startData.data[i + 1];
			const sb = this.startData.data[i + 2];
			const sa = this.startData.data[i + 3];

			const er = endData.data[i];
			const eg = endData.data[i + 1];
			const eb = endData.data[i + 2];
			const ea = endData.data[i + 3];

			delta[i] = er - sr;
			delta[i + 1] = eg - sg;
			delta[i + 2] = eb - sb;
			delta[i + 3] = ea - sa;
		}

		this.clear();

		const compact = this.compactImageData(delta, layer.width, layer.height);

		return compact;
	}

	private compactImageData(data: any[], width: number, height: number) {
		const min = { x: width, y: height };
		const max = { x: 0, y: 0 };

		for (let j = 0; j < height; j++) {
			for (let i = 0; i < width; i++) {
				const index = (i + j * width) * 4;
				const changed =
					data[index + 0] ||
					data[index + 1] ||
					data[index + 2] ||
					data[index + 3];

				if (!changed) continue;

				if (i < min.x) min.x = i;
				if (i > max.x) max.x = i;

				if (j < min.y) min.y = j;
				if (j > max.y) max.y = j;
			}
		}

		const dx = min.x;
		const dy = min.y;
		const nWidth = max.x - dx + 1;
		const nHeight = max.y - dy + 1;

		const nArray = new Array(nWidth * nHeight * 4);

		for (let j = 0; j < nHeight; j++) {
			for (let i = 0; i < nWidth; i++) {
				const index = (i + j * nWidth) * 4;
				const bigIndex = (i + dx + (j + dy) * width) * 4;

				nArray[index + 0] = data[bigIndex + 0];
				nArray[index + 1] = data[bigIndex + 1];
				nArray[index + 2] = data[bigIndex + 2];
				nArray[index + 3] = data[bigIndex + 3];
			}
		}

		return {
			dx,
			dy,
			data: nArray,
			width: nWidth,
			height: nHeight,
		};
	}

	clear() {
		this.startData = undefined;
	}
}
