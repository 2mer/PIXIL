import { Graphics, Renderer, RenderTexture } from 'pixi.js';

export default function createCheckerboardTexture(
	renderer: Renderer,
	c1: number,
	c2: number
) {
	const res = 8;
	const halfRes = res / 2;

	const tex = RenderTexture.create({ width: res, height: res });

	const g = new Graphics();
	// c1
	g.beginFill(c1);
	g.drawRect(0, 0, res, res);
	g.endFill();
	// c2
	g.beginFill(c2);
	g.drawRect(halfRes, 0, halfRes, halfRes);
	g.drawRect(0, halfRes, halfRes, halfRes);
	g.endFill();

	renderer.render(g, { renderTexture: tex });

	return tex;
}
