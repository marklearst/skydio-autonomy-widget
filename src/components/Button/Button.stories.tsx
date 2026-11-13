import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { Button } from 'components'
import { Icons, type IconName } from 'icons'

const meta: Meta<typeof Button> = {
  title: 'Components/Buttons',
  component: Button,
  tags: ['autodocs'],
  args: {
    icon: 'PlayIcon',
    label: '',
    ariaLabel: 'Play',
    variant: 'default',
    size: 32,
    tooltip: '',
    flex: false,
    disabled: false,
    onClick: fn(),
  },
  parameters: {
    controls: { include: ['icon', 'label', 'Accessible name', 'variant', 'size', 'tooltip', 'flex', 'disabled'] },
    docs: {
      description: {
        component:
          'Native action control with typed mission treatments, visible keyboard focus, and dismissible help. Targets adapt from 32px to 44px on coarse pointers.',
      },
    },
    a11y: {
      config: { rules: [{ id: 'button-name', enabled: true }] },
    },
  },
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(Icons),
      description: 'Icon displayed before the label. Every option is available in the shared icon library.',
      table: { category: 'Content', type: { summary: 'IconName' }, defaultValue: { summary: 'None' } },
    },
    label: {
      control: 'text',
      description: 'Visible button text. Leave empty for an icon-only button.',
      table: { category: 'Content', type: { summary: 'string' }, defaultValue: { summary: 'No visible text' } },
    },
    ariaLabel: {
      control: 'text',
      name: 'Accessible name',
      description: 'Names icon-only actions for assistive technology. Visible text can name a text button; native aria-label is also supported.',
      table: { category: 'Accessibility', type: { summary: 'string' }, defaultValue: { summary: 'Visible text, if present' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'play', 'stop', 'action', 'caret', 'play-borderless', 'stop-borderless', 'caret-borderless'],
      description: 'Visual treatment for neutral, mission, pause, resume, or expand controls.',
      table: { category: 'Appearance', type: { summary: 'ButtonVariant' }, defaultValue: { summary: 'default' } },
    },
    size: {
      control: { type: 'inline-radio', labels: { 32: 'Square', auto: 'Fit content' } },
      options: [32, 'auto'],
      description: 'Square target or content width. Height follows the shared control-size token: 32px on fine pointers, 44px on coarse pointers.',
      table: { category: 'Appearance', type: { summary: '32 | "auto"' }, defaultValue: { summary: '32' } },
    },
    tooltip: {
      control: 'text', description: 'Help text shown on hover or keyboard focus. Leave empty to omit the tooltip.',
      table: { category: 'Content', type: { summary: 'string' }, defaultValue: { summary: 'None' } },
    },
    flex: {
      control: 'boolean', description: 'Share available width with sibling buttons in a flex container.',
      table: { category: 'Appearance', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean', description: 'Prevent activation and apply the disabled appearance.',
      table: { category: 'Behavior', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onClick: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const IconOnly: Story = {
  args: {
    icon: 'PlayIcon' as IconName,
    ariaLabel: 'Play',
    variant: 'action',
    size: 32,
  },
}

export const TextOnly: Story = {
  argTypes: { icon: { table: { disable: true } } },
  args: {
    icon: undefined,
    label: 'Exit Mission',
    ariaLabel: 'Exit Mission',
    variant: 'action',
    size: 'auto',
  },
}

export const IconAndText: Story = {
  args: {
    icon: 'XSquareIcon' as IconName,
    label: 'Exit Mission',
    ariaLabel: 'Exit Mission',
    variant: 'action',
    size: 'auto',
  },
}

export const Play: Story = {
  args: {
    icon: 'PlayIcon' as IconName,
    ariaLabel: 'Play',
    variant: 'play-borderless',
    size: 32,
  },
}

export const Stop: Story = {
  args: {
    icon: 'StopSignIcon' as IconName,
    ariaLabel: 'Stop',
    variant: 'stop-borderless',
    size: 32,
  },
}

export const Camera: Story = {
  args: {
    icon: 'CameraViewfinderIcon' as IconName,
    ariaLabel: 'Camera',
    variant: 'action',
    size: 32,
  },
}

export const Expand: Story = {
  args: {
    icon: 'ChevronDownIcon' as IconName,
    ariaLabel: 'Expand',
    variant: 'caret-borderless',
    size: 32,
  },
}

export const Collapse: Story = {
  args: {
    icon: 'ChevronUpIcon' as IconName,
    ariaLabel: 'Collapse',
    variant: 'caret-borderless',
    size: 32,
  },
}

export const Route: Story = {
  args: {
    icon: 'RouteIcon' as IconName,
    ariaLabel: 'Route',
    variant: 'default',
    size: 'auto',
    flex: true,
  },
}

export const WithTooltip: Story = {
  args: {
    icon: 'PlayIcon' as IconName,
    ariaLabel: 'Play',
    variant: 'play-borderless',
    size: 32,
    tooltip: 'Start the action',
  },
}

export const Disabled: Story = {
  args: {
    icon: undefined,
    label: 'Exit Mission',
    ariaLabel: 'Exit Mission',
    disabled: true,
    size: 'auto',
    variant: 'action',
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: args.ariaLabel })
    await expect(button).toBeDisabled()
    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const ActivationInteraction: Story = {
  ...IconOnly,
  parameters: { controls: { disable: true } },
  play: async ({ args, canvas, userEvent, step }) => {
    const button = canvas.getByRole('button', { name: args.ariaLabel })
    await step('Activate with a pointer', async () => {
      await userEvent.click(button)
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })
    await step('Activate with the keyboard', async () => {
      await expect(button).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await expect(args.onClick).toHaveBeenCalledTimes(2)
    })
  },
}

export const TooltipInteraction: Story = {
  ...WithTooltip,
  parameters: { controls: { disable: true } },
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const button = canvas.getByRole('button', { name: args.ariaLabel })
    const body = within(canvasElement.ownerDocument.body)
    await step('Read help with a pointer', async () => {
      await userEvent.hover(button)
      const tooltip = await body.findByRole('tooltip')
      await expect(tooltip).toHaveTextContent(args.tooltip || '')
      await userEvent.hover(tooltip)
      await expect(tooltip).toBeVisible()
      await userEvent.unhover(tooltip)
      await waitFor(async () => { await expect(body.queryByRole('tooltip')).not.toBeInTheDocument() })
    })
    await step('Read and dismiss help with the keyboard', async () => {
      await userEvent.tab()
      await expect(button).toHaveFocus()
      await expect(await body.findByRole('tooltip')).toBeVisible()
      await userEvent.keyboard('{Escape}')
      await expect(body.queryByRole('tooltip')).not.toBeInTheDocument()
      await expect(button).toHaveFocus()
      await userEvent.tab()
    })
  },
}
