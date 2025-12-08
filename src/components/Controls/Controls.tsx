import { AutonomyButton } from '../AutonomyButton'
import type { AutonomyButtonProps } from '../AutonomyButton/AutonomyButton'
import type { IconName } from '../../assets/icons'

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
