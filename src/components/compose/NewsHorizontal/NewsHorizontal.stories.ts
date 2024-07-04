import type { Meta, StoryObj } from '@storybook/react';
import { mock_figure } from 'shared/mocks/mocks';

import NewsHorizontal from './NewsHorizontal';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/NewsHorizontal',
  component: NewsHorizontal,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    news: { title: { name: 'Title' } },
    badgeType: {
      name: 'Badge type',
      control: 'select',
      options: ['default', 'titled']
    },
    showDivider: { name: 'Show divider', control: 'boolean' }
  }
} satisfies Meta<typeof NewsHorizontal>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    news: {
      title:
        'Aliquam aliquam mi arcu, quis sagittis ligula pellentesque quis. Donec vulputate pellentesque aliquam. Aenean nulla massa',
      cover: '1719234881163',
      section: {
        primaryColor: '#C34040',
        name: 'Esporte'
      }
    },
    width: '500px'
  }
};

export const NoBadge: Story = {
  args: {
    news: {
      title:
        'Aliquam aliquam mi arcu, quis sagittis ligula pellentesque quis. Donec vulputate pellentesque aliquam. Aenean nulla massa',
      cover: '1719234881163'
    },
    width: '500px'
  }
};
