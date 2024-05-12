import type { Meta, StoryObj } from '@storybook/react';

import { Quote } from './Quote';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Quote',
  component: Quote,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    text: {
      control: 'text',
      name: 'Text'
    }
  }
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    text:
      'Aliquam aliquam mi arcu, quis sagittis ligula pellentesque quis. ' +
      'Donec vulputate pellentesque aliquam. Aenean nulla massa'
  }
};
