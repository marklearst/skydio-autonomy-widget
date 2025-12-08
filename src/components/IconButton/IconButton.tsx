import React, { useRef, useState, useMemo } from 'react'
import * as Icons from '../../assets/icons'
import type { IconName, IconComponentType } from '../../assets/icons'
import { Tooltip } from '../Tooltip'

export type IconButtonVariant = 'default' | 'stop' | 'play' | 'action' | 'caret'
export type IconButtonSize = 32 | 50

export interface IconButtonProps {
  icon: IconName
  tooltip?: string
  onClick?: () => void
  ariaLabel: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  flex?: boolean
  buttonStyle?: string
  iconRotation?: 'rotate-90' | 'rotate-180' | 'rotate-270' | ''
  disabled?: boolean
}

const variantClasses: Record<IconButtonVariant, string> = {
  // default:
  //   'bg-transparent hover:bg-transparent dark:bg-gray-800 dark:hover:bg-gray-700',
  // play: 'bg-[#0066CC] hover:bg-[#005bb5] dark:bg-blue-700 dark:hover:bg-blue-600',
  // stop: 'bg-[#941920] hover:bg-[#7a161f] dark:bg-red-800 dark:hover:bg-red-700',
  // action:
  //   'bg-[#333333] hover:bg-[#444444] dark:bg-gray-700 dark:hover:bg-gray-600',
  // caret:
  //   'bg-transparent hover:bg-[#3A3A3A] dark:bg-gray-800 dark:hover:bg-gray-700',
  default: 'bg-transparent hover:bg-transparent',
  play: 'bg-[#0066CC] hover:bg-[#005bb5]',
  stop: 'bg-[#941920] hover:bg-[#7a1620]',
  action: 'bg-[#222222] hover:bg-[#444444]',
  caret: 'bg-transparent hover:bg-[#3A3A3A]',
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltip,
  onClick,
  ariaLabel,
  variant = 'default',
  size = 32,
  flex = false,
  buttonStyle = '',
  iconRotation = '',
  disabled = false,
}) => {
  const IconComponent = useMemo(() => Icons[icon] as IconComponentType, [icon])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)

  if (!IconComponent) {
    console.error(`Icon "${icon}" not found in icons barrel.`)
    return (
      <span
        aria-label={ariaLabel}
        className="text-red-500">
        ⚠️
      </span>
    )
  }

  const handleMouseEnter = () => {
    if (buttonRef.current && !rect) {
      setRect(buttonRef.current.getBoundingClientRect())
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
          ${size === 32 ? 'w-8 h-8' : 'w-[50px] h-8'}
          rounded-[2px]
          ${buttonStyle}
          ${variantClasses[variant]}
          ${flex ? 'flex-1' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={ariaLabel}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}>
        <span className={iconRotation}>
          <IconComponent
            width={16}
            height={16}
            className="pointer-events-none"
          />
        </span>
      </button>
      {tooltip && rect && (
        <Tooltip
          targetRect={rect}
          visible={hovered}>
          {tooltip}
        </Tooltip>
      )}
    </>
  )
}

export default IconButton
