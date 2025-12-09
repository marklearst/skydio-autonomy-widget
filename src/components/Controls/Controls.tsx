import { AutonomyButton } from '../AutonomyButton'
import type { AutonomyButtonProps } from 'components'
import type { IconName } from 'icons'

/**
 * Props for the Controls component.
 * @property buttons - Array of button configs (see AutonomyButtonProps)
 * @property className - Additional CSS classes for the controls container
 */
export interface ControlsProps {
  buttons?: Omit<AutonomyButtonProps, 'flex'>[]
  className?: string
}

const defaultButtons: Omit<AutonomyButtonProps, 'flex'>[] = [
  {
    icon: 'ArrowLeftIcon' as IconName,
    ariaLabel: 'Go Left',
    buttonStyle: 'border border-[#4D4D4D]',
    variant: 'action',
  },
  {
    icon: 'CaretIcon' as IconName,
    ariaLabel: 'Left',
    buttonStyle: 'border border-[#4D4D4D]',
    iconRotation: 'rotate-90',
    variant: 'action',
  },
  {
    icon: 'CaretIcon' as IconName,
    ariaLabel: 'Right',
    buttonStyle: 'border border-[#4D4D4D]',
    iconRotation: 'rotate-270',
    variant: 'action',
  },
  {
    icon: 'CameraIcon' as IconName,
    ariaLabel: 'Camera',
    buttonStyle: 'border border-[#4D4D4D]',
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
      <AutonomyButton
        key={`${btn.ariaLabel}-${i}`}
        {...btn}
        flex
      />
    ))}
  </div>
)
