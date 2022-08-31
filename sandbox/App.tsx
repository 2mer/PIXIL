import React from 'react'
import { Brush, CheckerboardOverlay, ConstraintsSystem, Eraser, MovementSystem, OutlineOverlay } from '../src';
import loadImage from '../src/util/loadImage';
import useEditor from './useEditor';

export default function App() {

	const [ref, editor] = useEditor({
		width: 600, height: 600,
		backgroundColor: 0xaeaeae,
	})

	React.useEffect(() => {
		if (editor) {
			// setup interactions
			editor.viewport.drag({ mouseButtons: 'middle' }).wheel().pinch()
			// editor.viewport.drag().wheel().pinch()

			editor.addAddon(new CheckerboardOverlay({ c1: 0x797979, c2: 0xc3c3c3 }))
			editor.addAddon(new OutlineOverlay({ width: 1, color: 0x323232 }))

			// editor.addTool(new Brush(editor, { buttons: [0] }));
			editor.addTool(new Eraser(editor, { buttons: [0] }));

			// set canvas size to first image load
			loadImage('logo192.png').then(image => {
				editor.setCanvasSize(image.width, image.height);

				// draw the image onto the layer
				const imageLayer = editor.createLayer().drawImage(image);

				const drawingLayer = editor.createLayer().render(ctx => {
					ctx.fillStyle = "#ff0000FF"

					ctx.lineWidth = 1

					const halfW = ctx.lineWidth / 2;

					ctx.beginPath();
					ctx.rect(0 + halfW, 0 + halfW, 20 - 2 * halfW, 20 - 2 * halfW);
					ctx.stroke();
				});

				editor.setFocusedLayer(imageLayer);
			});

			const ms = new MovementSystem();
			ms.wasd().arrows().plusminus();
			editor.addAddon(ms);

			const cs = new ConstraintsSystem({ minZoom: 2, maxZoom: 10 });
			editor.addAddon(cs);

			(window as any).$editor = editor;
		}
	}, [editor])

	return (
		<div>
			<p>Editor test</p>
			<div ref={ref} />
		</div>
	)
}
