import type { Meta, StoryObj } from '@storybook/react-vite'
import { AutonomyWidget } from './AutonomyWidget'

const meta: Meta<typeof AutonomyWidget> = {
  title: 'Components/AutonomyWidget',
  component: AutonomyWidget,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A widget displaying a timer, status, and action controls with pause/resume functionality.',
      },
    },
    a11y: {
      config: { rules: [{ id: 'landmark-one-main', enabled: true }] },
    },
    viewport: {
      defaultViewport: 'responsive',
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  argTypes: {
    actionName: { control: 'text', description: 'Name of the current action.' },
    time: {
      control: { type: 'number', min: 0 },
      description: 'Timer duration in seconds.',
    },
    expanded: {
      control: 'boolean',
      description: 'Whether controls are expanded.',
    },
    isPaused: {
      control: 'boolean',
      description: 'Whether the timer is paused.',
    },
    onPauseChange: {
      action: 'pause-changed',
      description: 'Callback for pause state changes.',
    },
    onNameChange: {
      action: 'action-name-changed',
      description: 'Callback for action name changes.',
    },
  },
}

export default meta
type Story = StoryObj<typeof AutonomyWidget>

export const Running: Story = {
  args: {
    actionName: 'Flying to Point 1',
    time: 407,
  },
  render: (args, { updateArgs }) => (
    <AutonomyWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

export const Paused: Story = {
  args: {
    actionName: 'Mission Paused',
    time: 407,
    isPaused: true,
  },
  render: (args, { updateArgs }) => (
    <AutonomyWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

export const Expanded: Story = {
  args: {
    actionName: 'Flying to Point 1',
    time: 407,
    expanded: true,
  },
  render: (args, { updateArgs }) => (
    <AutonomyWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

// export const Compact: Story = {
//   args: {
//     actionName: 'Flying to Point 1',
//     time: 60,
//   },
//   parameters: {
//     viewport: { defaultViewport: 'mobile1' }, // <1280px
//   },
//   render: (args, { updateArgs }) => (
//     <AutonomyWidget
//       {...args}
//       onPauseChange={(paused) => updateArgs({ isPaused: paused })}
//       onNameChange={(name) => updateArgs({ actionName: name })}
//     />
//   ),
// }

export const ZeroDuration: Story = {
  args: {
    actionName: 'Idle',
    time: 0,
  },
  render: (args, { updateArgs }) => (
    <AutonomyWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

export const SingleButton: Story = {
  args: {
    actionName: 'Single Button',
    time: 90,
    expanded: true,
    buttons: [
      {
        icon: 'XIcon',
        ariaLabel: 'Close',
        variant: 'action',
        buttonStyle: 'border border-[#4D4D4D]',
      },
    ],
  },
  render: (args, { updateArgs }) => (
    <AutonomyWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

export const TwoButtons: Story = {
  args: {
    actionName: 'Two Buttons',
    time: 120,
    expanded: true,
    buttons: [
      {
        icon: 'CaretIcon',
        ariaLabel: 'Left',
        variant: 'action',
        buttonStyle: 'border border-[#4D4D4D]',
        iconRotation: 'rotate-90',
      },
      {
        icon: 'CaretIcon',
        ariaLabel: 'Right',
        variant: 'action',
        buttonStyle: 'border border-[#4D4D4D]',
        iconRotation: 'rotate-270',
      },
    ],
  },
  render: (args, { updateArgs }) => (
    <AutonomyWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

// export const Breakpoint: Story = {
//   args: {
//     actionName: 'Testing Breakpoint',
//     time: 300,
//   },
//   parameters: {
//     viewport: {
//       viewports: {
//         small: { name: 'Small', styles: { width: '600px', height: '800px' } },
//         medium: {
//           name: 'Medium',
//           styles: { width: '1280px', height: '800px' },
//         },
//         large: { name: 'Large', styles: { width: '1920px', height: '1080px' } },
//       },
//       defaultViewport: 'small', // Start with <1280px to test 88px
//     },
//     backgrounds: { default: 'dark' },
//   },
//   render: (args, { updateArgs }) => (
//     <AutonomyWidget
//       {...args}
//       onPauseChange={(paused) => updateArgs({ isPaused: paused })}
//       onNameChange={(name) => updateArgs({ actionName: name })}
//     />
//   ),
// }
