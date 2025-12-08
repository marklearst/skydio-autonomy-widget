import { ActionButton } from '../ActionButton'
import type { ActionButtonProps } from '../ActionButton/ActionButton'
import type { IconName } from '../../assets/icons'

export interface ActionControlsProps {
  buttons?: Omit<ActionButtonProps, 'flex'>[]
  className?: string
}

const defaultButtons: Omit<ActionButtonProps, 'flex'>[] = [
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

export const ActionControls: React.FC<ActionControlsProps> = ({
  buttons = defaultButtons,
  className = '',
}) => (
  <div
    className={`flex gap-2 ${className}`}
    style={{ minWidth: 50 }}
    role="toolbar"
    aria-label="Action Controls">
    {buttons.map((btn, i) => (
      <ActionButton
        key={`${btn.ariaLabel}-${i}`}
        {...btn}
        flex
      />
    ))}
  </div>
)
