import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BaseEditorDemo from './BaseEditorDemo';
import Editor from '../Editor';
import BrushTool from '../tools/Brush/Brush';
import EraserTool from '../tools/Eraser/Eraser';
import FillTool from '../tools/Fill/Fill';

import { Graphics } from 'pixi.js';
import Color from 'color';
import loadImage from '../util/loadImage';

export default {
	title: 'Examples',
	component: BaseEditorDemo,
} as ComponentMeta<typeof BaseEditorDemo>;

const Template: ComponentStory<typeof BaseEditorDemo> = (args) => (
	<BaseEditorDemo {...args} />
);

export const Brush = Template.bind({});
Brush.args = {
	Component: ({ editor }: { editor: Editor }) => {
		React.useEffect(() => {
			editor.addTool(new BrushTool(editor, { buttons: [0] }));
		}, []);

		return null;
	},
};

export const Eraser = Template.bind({});
Eraser.args = {
	Component: ({ editor }: { editor: Editor }) => {
		React.useEffect(() => {
			editor.addTool(new EraserTool(editor, { buttons: [0] }));
		}, []);

		return null;
	},
};

export const Fill = Template.bind({});
Fill.args = {
	Component: ({ editor }: { editor: Editor }) => {
		React.useEffect(() => {
			editor.addTool(new FillTool(editor, { buttons: [0] }));
		}, []);

		return null;
	},
};

export const Overlay = Template.bind({});
Overlay.args = {
	Component: ({ editor }: { editor: Editor }) => {
		React.useEffect(() => {
			const g = new Graphics();

			g.beginFill(0xff0000);
			g.drawCircle(192 / 4, 192 / 4, 192 / 4);
			g.endFill();
			g.alpha = 0.5;

			editor.viewport.addChild(g);
		}, []);

		return null;
	},
};

export const Layers = Template.bind({});
Layers.args = {
	Component: ({ editor }: { editor: Editor }) => {
		React.useEffect(() => {
			loadImage('logo192.png').then((image) => {
				editor.setCanvasSize(image.width, image.height);
				editor.createLayer();
				editor.createLayer();
			});

			class RainbowBrush extends BrushTool {
				getColor() {
					const c = Color.hsv(
						((Date.now() % 10_000) / 10_000) * 360,
						100,
						50
					);

					return c;
				}
			}

			console.log(editor.getLayers().length);

			editor.addTool(new RainbowBrush(editor, { buttons: [0] }));
		}, []);

		return (
			<div>
				<button
					onClick={() => editor.setFocusedLayer(editor.layers[0])}
				>
					layer 1
				</button>
				<button
					onClick={() => editor.setFocusedLayer(editor.layers[1])}
				>
					layer 2
				</button>
				<button
					onClick={() => editor.setFocusedLayer(editor.layers[2])}
				>
					layer 3
				</button>
			</div>
		);
	},
};

export const Export = Template.bind({});
Export.args = {
	Component: ({ editor }: { editor: Editor }) => {
		React.useEffect(() => {
			editor.addTool(new FillTool(editor, { buttons: [0] }));
		}, []);

		return (
			<button
				onClick={() => {
					const imgUrl =
						editor.focusedLayer.canvas.toDataURL('image/png');

					var a = document.createElement('a');
					a.href = imgUrl;
					a.download = 'output.png';
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				}}
			>
				export
			</button>
		);
	},
};
