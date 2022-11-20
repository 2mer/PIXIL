import React from 'react';
import HistoryList from '../../sandbox/HistoryList';
import useEditor from '../../sandbox/useEditor';
import ConstraintsSystem from '../addon/ConstraintsSystem';
import MovementSystem from '../addon/MovementSystem';
import CheckerboardOverlay from '../addon/overlays/CheckerboardOverlay/CheckerboardOverlay';
import OutlineOverlay from '../addon/overlays/OutlineOverlay';
import loadImage from '../util/loadImage';

export default function BaseEditorDemo({ Component }) {
	const [ref, editor] = useEditor({
		width: 192,
		height: 192,
		backgroundColor: 0xaeaeae,
	});

	React.useEffect(() => {
		if (editor) {
			editor.history.enabled = true;
			editor.history.limit = 5;
			// setup interactions
			editor.viewport.drag({ mouseButtons: 'middle' }).wheel().pinch();
			// editor.viewport.drag().wheel().pinch()

			editor.addAddon(
				new CheckerboardOverlay({ c1: 0x797979, c2: 0xc3c3c3 })
			);
			editor.addAddon(new OutlineOverlay({ width: 1, color: 0x323232 }));

			// editor.addTool(new Brush(editor, { buttons: [0] }));

			// set canvas size to first image load
			loadImage('logo192.png').then((image) => {
				editor.setCanvasSize(image.width, image.height);

				// draw the image onto the layer
				const imageLayer = editor.createLayer().drawImage(image);

				editor.setFocusedLayer(imageLayer);
			});

			const ms = new MovementSystem();
			ms.wasd().arrows().plusminus();
			editor.addAddon(ms);

			const cs = new ConstraintsSystem({ minZoom: 1, maxZoom: 10 });
			editor.addAddon(cs);
		}
	}, [editor]);

	return (
		<div style={{ display: 'flex' }}>
			<div>
				<div ref={ref} />
			</div>
			<div>
				<HistoryList editor={editor} />
			</div>
			{editor && <Component editor={editor} />}
		</div>
	);
}
