import { faUser } from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { MenuButton } from './MenuButton';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Dashboard/MenuButton',
  component: MenuButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    label: { name: 'Label' }
  }
} satisfies Meta<typeof MenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  //@ts-ignore
  args: {
    label: 'Profile',
    icon: faUser
  }
};

export const Selected: Story = {
  //@ts-ignore
  args: {
    label: 'Profile',
    icon: faUser,
    preSelected: 'news'
  }
};
