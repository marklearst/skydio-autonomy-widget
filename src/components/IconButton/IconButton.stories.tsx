import type { Meta, StoryObj } from '@storybook/react-vite';
import IconButton from './IconButton';
// import { FaPause, FaPlay, FaStop } from 'react-icons/fa';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: <FaPause />,
    ariaLabel: 'Pause',
    variant: 'default',
  },
};

export const Danger: Story = {
  args: {
    icon: <FaStop />,
    ariaLabel: 'Stop',
    variant: 'danger',
  },
};

export const Primary: Story = {
  args: {
    icon: <FaPlay />,
    ariaLabel: 'Play',
    variant: 'primary',
  },
};
