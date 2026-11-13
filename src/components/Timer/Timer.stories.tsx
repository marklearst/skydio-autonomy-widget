import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from 'storybook/test';
import { Timer } from "components";

const meta: Meta<typeof Timer> = {
  title: "Components/Timer",
  component: Timer,
  tags: ["autodocs"],
  args: { duration: 60, state: 'running', condensed: false, tooltip: '', onComplete: fn() },
  parameters: {
    controls: { include: ['duration', 'state', 'condensed', 'tooltip', 'progress'] },
    docs: {
      description: {
        component:
          "Local countdown in a fixed ring. Text yields to the mission icon after six seconds; pause and completion restore time. Keyboard help and reduced motion have explicit paths.",
      },
    },
    a11y: {
      config: { rules: [{ id: "aria-live-regions", enabled: true }] },
    },
  },
  argTypes: {
    duration: {
      control: { type: 'number', min: 0, max: 3599, step: 1 },
      description: 'Duration in seconds. Values are clamped to 0–3,599 (59:59); changing the duration restarts the countdown.',
      table: { category: 'Countdown', type: { summary: 'number' }, defaultValue: { summary: 'Required' } },
    },
    state: {
      control: 'inline-radio', options: ['running', 'paused'],
      description: 'Running counts down once per second. Paused preserves the remaining time.',
      table: { category: 'Countdown', type: { summary: '"running" | "paused"' }, defaultValue: { summary: 'running' } },
    },
    condensed: {
      control: 'boolean',
      description: 'Show the mission icon instead of time text, including while paused or complete. The accessible label still includes remaining time.',
      table: { category: 'Presentation', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    tooltip: {
      control: 'text', description: 'Optional help text shown on hover or keyboard focus. The pointer can move onto help; Escape dismisses it.',
      table: { category: 'Presentation', type: { summary: 'string' }, defaultValue: { summary: 'None' } },
    },
    progress: { table: { disable: true } },
    icon: { table: { disable: true } },
    onComplete: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Timer>;

export const Default: Story = {
  args: {
    duration: 60,
    state: "running",
  },
};

export const Running: Story = {
  args: {
    duration: 600,
    state: "running",
  },
};

export const Paused: Story = {
  args: {
    duration: 64,
    state: "paused",
  },
};

export const LongDuration: Story = {
  args: {
    duration: 3599,
    state: "running",
  },
};

export const Condensed: Story = {
  args: {
    duration: 60,
    condensed: true,
  },
};

export const NegativeDuration: Story = {
  args: {
    duration: -10,
    state: "running",
  },
};

export const Completion: Story = {
  args: { duration: 1, onComplete: fn() },
  play: async ({ args, canvas }) => {
    await waitFor(async () => {
      await expect(canvas.getByRole('img', { name: 'Timer: 0:00 remaining' })).toBeVisible();
      await expect(args.onComplete).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
  },
};

export const ProgressOverride: Story = {
  args: { duration: 120, state: 'paused', progress: 0.5 },
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Override the remaining ring fraction from 0 (empty) to 1 (full). Does not change the countdown text.',
      table: { disable: false, category: 'Countdown', type: { summary: 'number' }, defaultValue: { summary: 'Calculated from remaining time' } },
    },
  },
  parameters: { docs: { description: { story: 'A paused timer with an explicit ring value. Adjust progress to inspect the ring independently of the countdown.' } } },
};
