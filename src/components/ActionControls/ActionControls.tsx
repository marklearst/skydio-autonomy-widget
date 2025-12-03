import { IconButton } from '../IconButton'

import type { IconName } from '../../assets/icons'

export interface ActionControlButton {
  icon: IconName
  ariaLabel: string
  onClick?: () => void
  variant?: 'default' | 'stop' | 'play' | 'action' | 'caret'
  size?: 32 | 50
  className?: string
  disabled?: boolean
}

export interface ActionControlsProps {
  buttons?: ActionControlButton[]
  className?: string
}

const defaultButtons: ActionControlButton[] = [
  { icon: 'ArrowLeftIcon', ariaLabel: 'Collapse' },
  { icon: 'CaretIcon', ariaLabel: 'Left', className: 'rotate-180' },
  { icon: 'CaretIcon', ariaLabel: 'Right' },
  { icon: 'CameraIcon', ariaLabel: 'Camera' },
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
        className={btn.className}
        disabled={btn.disabled}
        flex
      />
    ))}
  </div>
)

export default ActionControls
