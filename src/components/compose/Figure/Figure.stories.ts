import type { Meta, StoryObj } from '@storybook/react';
import { mock_figure } from 'shared/mocks/mocks';

import { Figure } from './Figure';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Figure',
  component: Figure,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    fitType: {
      control: 'select',
      options: ['fill', 'contain', 'cover', 'none', 'scale-down']
    }
  }
} satisfies Meta<typeof Figure>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    src: mock_figure,
    caption: 'Aliquam aliquam mi arcu, quis sagittis ligula pellentesque quis.',
    width: 50
  }
};
