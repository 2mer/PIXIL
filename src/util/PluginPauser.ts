import { PluginManager } from 'pixi-viewport';

export default class PluginPauser {
	public readonly pluginsToPause;
	private prevPauseState = [];

	constructor(...pluginsToPause: string[]) {
		this.pluginsToPause = pluginsToPause;
	}

	pause(plugins: PluginManager) {
		this.prevPauseState = this.pluginsToPause.map((p) => {
			const prev = plugins[p]?.paused;
			plugins.pause(p);
			return prev;
		});
	}

	resume(plugins: PluginManager, force = false) {
		this.pluginsToPause.forEach((p) => {
			if (force || !this.prevPauseState[p]) {
				plugins.resume(p);
			}
		});
	}
}
