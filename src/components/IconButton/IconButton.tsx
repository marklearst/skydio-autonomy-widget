import React, { useRef, useState } from 'react'
import * as Icons from '../../assets/icons'
import type { IconName, IconComponentType } from '../../assets/icons'
import Tooltip from '../Tooltip'

export type IconButtonVariant = 'default' | 'stop' | 'play' | 'action' | 'caret'
export type IconButtonSize = 32 | 50

export interface IconButtonProps {
  icon: IconName
  tooltip?: string
  onClick?: () => void
  ariaLabel: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  flex?: boolean // If true, flex:1 for ActionControls row
  buttonStyle?: string // Tailwind classes for button container
  iconRotation?: 'rotate-90' | 'rotate-180' | 'rotate-270' | '' // Tailwind rotation for icon
  disabled?: boolean
}

const variantClasses: Record<IconButtonVariant, string> = {
  default: 'bg-transparent hover:bg-transparent',
  play: 'bg-[#0066CC] hover:bg-[#005bb5]',
  stop: 'bg-[#941920] hover:bg-[#7a1620]',
  action: 'bg-[#333333] hover:bg-[#444444]',
  caret: 'bg-transparent hover:bg-[#3A3A3A]',
}

/**
 * IconButton – always renders a 16x16 icon centered inside a 32x32 or 50x32 button.
 * - 2px border radius
 * - No icon scaling, always centered
 * - Supports flex for ActionControls row
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltip,
  onClick,
  ariaLabel,
  variant = 'default',
  size = 32,
  flex = false,
  buttonStyle,
  iconRotation,
  disabled = false,
}) => {
  const IconComponent = Icons[icon] as unknown as IconComponentType

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)

  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in icons barrel.`)
    return null
  }

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      setRect(buttonRect)
    }
    setHovered(true)
  }

  const handleMouseLeave = () => {
    setHovered(false)
  }

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        disabled={disabled}
        className={`inline-flex items-center justify-center relative transition-colors
        ${size === 32 ? 'w-8 h-8' : 'w-[50px] h-[50px]'}
        rounded-[2px]
        ${variantClasses[variant]}
        ${flex ? 'flex-1' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${buttonStyle}
      `}
        aria-label={ariaLabel}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        tabIndex={0}>
        <span className={iconRotation}>
          <IconComponent
            width={16}
            height={16}
            className={'pointer-events-none'}
          />
        </span>
      </button>
      {tooltip && (
        <Tooltip
          targetRect={rect}
          visible={hovered}>
          {tooltip}
        </Tooltip>
      )}
    </>
  )
}

// TODO: Add loading state if needed in future
