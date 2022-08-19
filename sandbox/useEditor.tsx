import { useEffect, useRef, useState } from "react";
import { Editor, EditorOptions } from "../src";


export default function useEditor(options: EditorOptions) {
	const ref = useRef<any>();
	const [editor, setEditor] = useState<Editor>();

	useEffect(() => {
		const ed = new Editor(options);

		const node = ref.current;

		node.appendChild(ed.app.view);

		setEditor(ed);

		return () => {
			node.removeChild(ed.app.view);
			ed.app.destroy();
		}

	}, [])

	const isReady = Boolean(editor);

	return [ref, editor, isReady] as const;
}