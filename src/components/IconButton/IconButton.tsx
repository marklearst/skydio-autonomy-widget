import React from 'react'
import * as Icons from '../../assets/icons'
import type { IconName, IconComponentType } from '../../assets/icons'

export type IconButtonVariant = 'default' | 'stop' | 'play' | 'action'
export type IconButtonSize = 32 | 50

export interface IconButtonProps {
  icon: IconName
  onClick?: () => void
  ariaLabel: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  flex?: boolean // If true, flex:1 for ActionControls row
  className?: string // Optional custom class for additional styling
  disabled?: boolean
}

const variantClasses: Record<IconButtonVariant, string> = {
  default: 'bg-transparent hover:bg-gray-400',
  play: 'bg-[#941920] hover:bg-[#7a1620]',
  stop: 'bg-[#0066CC] hover:bg-[#005bb5]',
  action: 'bg-[#4D4D4D] hover:bg-[#343434]',
}

/**
 * IconButton – always renders a 16x16 icon centered inside a 32x32 or 50x32 button.
 * - 2px border radius
 * - No icon scaling, always centered
 * - Supports flex for ActionControls row
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  variant = 'default',
  size = 32,
  flex = false,
  className,
  disabled = false,
}) => {
  const IconComponent = Icons[icon] as unknown as IconComponentType
  console.trace('IconComponent: ', IconComponent)

  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in icons barrel.`)
    return null
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`appearance-none border-none w-[32px] h-[32px] p-0 m-0 btn inline-flex items-center justify-center transition-colors ${
        variantClasses[variant]
      } ${size === 32 ? 'w-8 h-8' : 'w-[50px] h-8'} rounded-[2px] ${
        flex ? 'flex-1' : ''
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } focus:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-2 ${
        className ?? ''
      }`}
      onClick={onClick}
      aria-label={ariaLabel}
      tabIndex={0}>
      <IconComponent
        width={16}
        height={16}
        className="pointer-events-none"
      />
    </button>
  )
}

// TODO: Add loading state if needed in future
