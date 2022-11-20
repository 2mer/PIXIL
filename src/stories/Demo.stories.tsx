import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import App from '../../sandbox/App';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: 'Demo',
	component: App,
} as ComponentMeta<typeof App>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof App> = (args) => <App {...args} />;

export const Demo = Template.bind({});
Demo.args = {};
