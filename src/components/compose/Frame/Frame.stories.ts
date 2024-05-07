import type { Meta, StoryObj } from '@storybook/react';
import { Frame } from './Frame';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Frame',
  component: Frame,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    component: { name: 'component' }
  }
} satisfies Meta<typeof Frame>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Red: Story = {
  args: {}
};
