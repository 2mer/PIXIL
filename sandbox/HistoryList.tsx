import React from 'react'
import { Editor, Layer } from '../src';

export default function HistoryList({ editor = undefined as Editor | undefined }) {

	const [historyEntries, setHistoryEntries] = React.useState([])
	const [historyIndex, setHistoryIndex] = React.useState(0)

	React.useEffect(() => {

		if (editor) {
			return editor.history.onHistoryChanged.sub(({ history }) => {
				setHistoryEntries([...history.entries])
				setHistoryIndex(history.index);
			})
		}

	}, [editor])


	if (!editor) return null;

	return (
		<div>
			<div>History</div>
			<table>
				<thead>
					<tr>
						<th>index</th>
						<th>target</th>
						<th>identifier</th>
					</tr>
				</thead>
				<tbody>
					{historyEntries.map((entry, index) => {
						const isSelected = index === historyIndex;
						const isUndone = historyIndex < index;

						return <tr key={index} style={{ fontWeight: isSelected ? 'bold' : undefined, opacity: isUndone ? 0.5 : undefined }}>
							<td>{index}</td>
							<td>{(entry.target as Layer).name}</td>
							<td>{entry.identifier}</td>
						</tr>
					})}
				</tbody>
			</table>
			<button onClick={() => {
				if (editor) {
					editor.history.undo();
				}
			}}>undo</button>
			<button onClick={() => {
				if (editor) {
					editor.history.redo();
				}
			}}>redo</button>
		</div>
	)
}
