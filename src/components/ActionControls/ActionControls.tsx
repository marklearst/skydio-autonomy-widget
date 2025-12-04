import { IconButton } from '../IconButton'

import type { IconName } from '../../assets/icons'

export interface ActionControlButton {
  icon: IconName
  ariaLabel: string
  onClick?: () => void
  variant?: 'default' | 'stop' | 'play' | 'action' | 'caret'
  size?: 32 | 50
  buttonStyle?: string
  iconRotation?: 'rotate-90' | 'rotate-270' | 'rotate-180' | undefined
  disabled?: boolean
  tooltip?: string
}

export interface ActionControlsProps {
  buttons?: ActionControlButton[]
  className?: string
}

const defaultButtons: ActionControlButton[] = [
  {
    icon: 'ArrowLeftIcon',
    ariaLabel: 'Go Left',
    buttonStyle: 'border border-[#4D4D4D]',
  },
  {
    icon: 'CaretIcon',
    ariaLabel: 'Left',
    buttonStyle: 'border border-[#4D4D4D]',
    iconRotation: 'rotate-90',
  },
  {
    icon: 'CaretIcon',
    ariaLabel: 'Right',
    buttonStyle: 'border border-[#4D4D4D]',
    iconRotation: 'rotate-270',
  },
  {
    icon: 'CameraIcon',
    ariaLabel: 'Camera',
    buttonStyle: 'border border-[#4D4D4D]',
  },
]

const ActionControls: React.FC<ActionControlsProps> = ({
  buttons = defaultButtons,
  className,
}) => (
  <div
    className={`flex gap-2 ${className ?? ''}`}
    style={{ minWidth: 50 }}>
    {buttons.map((btn, i) => (
      <IconButton
        key={btn.icon + i}
        icon={btn.icon}
        ariaLabel={btn.ariaLabel}
        onClick={btn.onClick}
        variant={btn.variant ?? 'action'}
        size={btn.size ?? 32}
        buttonStyle={btn.buttonStyle}
        iconRotation={btn.iconRotation}
        disabled={btn.disabled}
        flex
      />
    ))}
  </div>
)

export default ActionControls
