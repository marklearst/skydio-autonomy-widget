import { Button } from 'components'
import type { ButtonProps } from 'components'
import type { IconName } from 'icons'

/**
 * Props for the Controls component.
 * @property buttons - Array of button configs (see ButtonProps)
 * @property className - Additional CSS classes for the controls container
 */
export interface ControlsProps {
  buttons?: Omit<ButtonProps, 'flex'>[]
  className?: string
}

const defaultButtons: Omit<ButtonProps, 'flex'>[] = [
  {
    icon: 'ArrowLeftIcon' as IconName,
    ariaLabel: 'Go Left',
    variant: 'action',
  },
  {
    icon: 'CaretIcon' as IconName,
    ariaLabel: 'Left',
    variant: 'action',
  },
  {
    icon: 'CaretIcon' as IconName,
    ariaLabel: 'Right',
    variant: 'action',
  },
  {
    icon: 'CameraViewfinderIcon' as IconName,
    ariaLabel: 'Camera',
    variant: 'action',
  },
]

/**
 * Controls is a UI component for rendering a group of directional and action buttons.
 *
 * @param {ControlsProps} props - The properties for configuring the controls.
 * @returns {JSX.Element} The rendered controls component.
 *
 * @remarks
 * - Renders a set of default or custom buttons for mission control.
 * - Designed for use in autonomy or navigation UIs.
 */
export const Controls: React.FC<ControlsProps> = ({
  buttons = defaultButtons,
  className = '',
}) => (
  <div
    className={`flex gap-2 ${className}`}
    style={{ minWidth: 50 }}
    role="toolbar"
    aria-label="Controls">
    {buttons.map((btn, i) => (
      <Button
        key={`${btn.ariaLabel}-${i}`}
        {...btn}
        flex
        ariaLabel={btn.ariaLabel}
      />
    ))}
  </div>
)
