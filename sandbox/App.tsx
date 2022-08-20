import React from 'react'
import loadImage from '../src/loadImage';
import CheckerboardOverlay from '../src/overlays/CheckerboardOverlay/CheckerboardOverlay';
import OutlineOverlay from '../src/overlays/OutlineOverlay';
import useEditor from './useEditor'

export default function App() {

	const [ref, editor] = useEditor({
		width: 600, height: 600,
		backgroundColor: 0xaeaeae,
	})

	React.useEffect(() => {
		if (editor) {
			// setup interactions
			editor.viewport.drag().wheel().pinch()

			editor.addUnderlay(new CheckerboardOverlay({ c1: 0x797979, c2: 0xc3c3c3 }))
			editor.addUnderlay(new OutlineOverlay({ width: 1, color: 0x323232 }))

			// set canvas size to first image load
			loadImage('logo192.png').then(image => {
				editor.setCanvasSize(image.width, image.height);

				// draw the image onto the layer
				editor.createLayer().drawImage(image);

				editor.createLayer().render(ctx => {
					ctx.fillStyle = "#ff0000FF"
					// ctx.fillRect(0.5, 0.5, 19.5, 19.5);

					ctx.lineWidth = 1

					const halfW = ctx.lineWidth / 2;

					ctx.beginPath();
					ctx.rect(0 + halfW, 0 + halfW, 20 - 2 * halfW, 20 - 2 * halfW);
					ctx.stroke();
				});
			});

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
