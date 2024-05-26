import type { Meta, StoryObj } from '@storybook/react';
import { NewsHeader } from 'components/compose/NewsHeader';
import { mock_author } from 'shared/mocks/mocks';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/NewsHeader',
  component: NewsHeader,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    news: { user: { name: 'Author' } }
  }
} satisfies Meta<typeof NewsHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    news: {
      title: 'Etiam sed est a leo vehicula pretium ac vitae tellus',
      user: mock_author,
      headline:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend' +
        'sit amet tortor sed condimentum. Mauris lobortis auctor tellus et ornare',
      createdAt: new Date()
    }
  }
};
