import React from 'react'
import { Brush, CheckerboardOverlay, ConstraintsSystem, Eraser, Fill, MovementSystem, OutlineOverlay } from '../src';
import loadImage from '../src/util/loadImage';
import HistoryList from './HistoryList';
import useEditor from './useEditor';

export default function App() {

	const [ref, editor] = useEditor({
		width: 600, height: 600,
		backgroundColor: 0xaeaeae,
	})

	const [selectedTool, setSelectedTool] = React.useState(null);

	React.useEffect(() => {
		if (editor && selectedTool) {

			editor.addTool(selectedTool)

			return () => {
				editor.removeTool(selectedTool)
			}
		}
	}, [editor, selectedTool])


	React.useEffect(() => {
		if (editor) {

			editor.history.enabled = true;
			editor.history.limit = 5;
			// setup interactions
			editor.viewport.drag({ mouseButtons: 'middle' }).wheel().pinch()
			// editor.viewport.drag().wheel().pinch()

			editor.addAddon(new CheckerboardOverlay({ c1: 0x797979, c2: 0xc3c3c3 }))
			editor.addAddon(new OutlineOverlay({ width: 1, color: 0x323232 }))

			// editor.addTool(new Brush(editor, { buttons: [0] }));

			// set canvas size to first image load
			loadImage('logo192.png').then(image => {
				editor.setCanvasSize(image.width, image.height);

				// draw the image onto the layer
				const imageLayer = editor.createLayer().drawImage(image);

				const drawingLayer = editor.createLayer();

				(window as any).rect = (x, y, w, h, color = 'red') => {
					drawingLayer.render(ctx => {
						ctx.strokeStyle = color;

						ctx.lineWidth = 1

						const halfW = ctx.lineWidth / 2;

						ctx.beginPath();
						ctx.rect(x + halfW, y + halfW, w - 2 * halfW, h - 2 * halfW);
						ctx.stroke();
					});
				}

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
		<div style={{ display: 'flex' }}>
			<div>
				<p>Editor test</p>
				<div ref={ref} />
				<div>
					<button onClick={() => {
						setSelectedTool(new Brush(editor, { buttons: [0] }))
					}}>brush</button>
					<button onClick={() => {
						setSelectedTool(new Eraser(editor, { buttons: [0] }))
					}}>eraser</button>
					<button onClick={() => {
						setSelectedTool(new Fill(editor, { buttons: [0] }))
					}}>fill</button>
				</div>
			</div>
			<div>
				<HistoryList editor={editor} />
			</div>
		</div>
	)
}
