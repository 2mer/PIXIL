import React from 'react'
import { Layer } from '../src'
import useEditor from './useEditor'

export default function App() {

	const [ref, editor] = useEditor({
		width: 600, height: 600,
		backgroundColor: 0xaeaeae,
		checkerboard: { c1: 0x797979, c2: 0xc3c3c3 },
		border: { width: 1, color: 0x333333 },
		setInteractions: (v) => {
			v.drag().wheel().pinch();
		}
	})

	React.useEffect(() => {
		if (editor) {
			Layer.fromUrl("logo192.png").then(editor.addLayer);

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
