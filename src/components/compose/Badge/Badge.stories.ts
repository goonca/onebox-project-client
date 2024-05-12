import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Bagde',
  component: Badge,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    color: { name: 'Color', control: 'color' }
  }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Red: Story = {
  args: {
    color: '#C34040',
    label: 'Esporte'
  }
};

export const Blue: Story = {
  args: {
    color: 'blue',
    label: 'Mundo'
  }
};
