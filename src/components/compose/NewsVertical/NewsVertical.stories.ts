import type { Meta, StoryObj } from '@storybook/react';
import { mock_figure } from 'shared/mocks/mocks';
import { BadgeTypeEnum, TextStyleEnum } from 'shared/types/api-type';

import NewsVertical from './NewsVertical';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/NewsVertical',
  component: NewsVertical,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    news: { title: { name: 'Title' } },

    showDivider: { name: 'Show divider', control: 'boolean' }
  }
} satisfies Meta<typeof NewsVertical>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    news: {
      title: 'Lorem ipsum dolor sit amet, consetur adipiscing elit',
      headline: 'Lorem ipsum dolor sit amet, consetur adipiscing elit',
      cover: '1719234881163',
      section: {
        primaryColor: '#C34040',
        name: 'Esporte'
      },
      customDisplay: {
        badgeType: BadgeTypeEnum.BLOCK,
        titleStyle: TextStyleEnum.LARGE
      }
    },
    width: '250px'
  }
};

export const NoBadge: Story = {
  args: {
    news: {
      title: 'Lorem ipsum dolor sit amet, consetur adipiscing elit',
      cover: '1719234881163'
    },
    width: '250px'
  }
};
