import EventEmitter from '@sgty/m-it';

export interface IHistoryTarget {
	undo(delta: any);
	redo(delta: any);
}

export type HistoryEntry = {
	target: IHistoryTarget;
	delta: any;
	identifier: any;
};

export default class History {
	index = -1;
	entries = [] as HistoryEntry[];
	limit = undefined as undefined | number;
	enabled = false;

	onHistoryChanged = new EventEmitter<{ history: History }>();

	add(entry: HistoryEntry) {
		if (!this.enabled) return;

		// override future entries (undone entries)
		this.entries.splice(this.index + 1);

		// add entry
		this.entries.push(entry);
		this.index++;

		this.onHistoryChanged.emit({ history: this });
	}

	undo() {
		if (!this.enabled) return;

		if (this.entries.length && this.index >= 0) {
			const h = this.entries[this.index];
			h.target.undo(h.delta);

			this.index--;

			this.onHistoryChanged.emit({ history: this });
		}
	}

	redo() {
		if (!this.enabled) return;

		if (this.entries.length && this.index < this.entries.length - 1) {
			this.index++;

			const h = this.entries[this.index];
			h.target.redo(h.delta);

			this.onHistoryChanged.emit({ history: this });
		}
	}
}
