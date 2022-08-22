export interface IHistoryTarget {
	undo(delta: any);
	redo(delta: any);
}

export type HistoryEntry = { target: IHistoryTarget; delta: any };

export default class History {
	index = -1;
	entries = [] as HistoryEntry[];

	add(entry: HistoryEntry) {
		// override future entries (undone entries)
		this.entries.splice(this.index + 1);

		// add entry
		this.entries.push(entry);
		this.index++;
	}

	undo() {
		const h = this.entries[this.index];
		h.target.undo(h.delta);

		this.index--;
	}

	redo() {
		this.index++;

		const h = this.entries[this.index];
		h.target.undo(h.delta);
	}
}
