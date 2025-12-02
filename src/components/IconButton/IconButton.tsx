import React from 'react'
import * as Icons from '../../assets/icons'
import type { IconName } from '../../assets/icons'

export type IconButtonVariant = 'default' | 'danger' | 'primary'
export type IconButtonSize = 32 | 50

export interface IconButtonProps {
  /** Icon name from src/assets/icons barrel */
  icon: IconName
  onClick?: () => void
  ariaLabel: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  flex?: boolean // If true, flex:1 for ActionControls row
  className?: string // Optional custom class for additional styling
}

const variantClasses: Record<IconButtonVariant, string> = {
  default: 'bg-gray-800 hover:bg-gray-700',
  danger: 'bg-[#941920] hover:bg-[#7a1620]', // StopSign button background
  primary: 'bg-[#0066CC] hover:bg-[#005bb5]', // Play button background
}

/**
 * IconButton – always renders a 16x16 icon centered inside a 32x32 or 50x32 button.
 * - 2px border radius
 * - Uses icon from src/assets/icons barrel
 * - No icon scaling, always centered
 * - Supports flex for ActionControls row
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  variant = 'default',
  size = 32,
  flex = false, // If true, flex:1 for ActionControls row
  className,
}) => {
  const IconComponent = Icons[icon]
  return (
    <button
      type="button"
      className={`bg-gray-800 inline-flex items-center justify-center transition-colors ${
        variantClasses[variant]
      } ${size === 32 ? 'w-8 h-8' : 'w-[50px] h-8'} rounded-[2px] ${
        flex ? 'flex-1' : ''
      } ${className ?? ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      tabIndex={0}>
      {IconComponent && (
        <IconComponent
          width={16}
          height={16}
          className="pointer-events-none"
        />
      )}
    </button>
  )
}

// TODO: Add focus ring, a11y improvements, and loading/disabled states if needed
