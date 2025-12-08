import React, { useRef, useState, useMemo } from 'react'
import * as Icons from '../../assets/icons'
import type { IconName, IconComponentType } from '../../assets/icons'
import { Tooltip } from '../Tooltip'

export type AutonomyButtonVariant =
  | 'default'
  | 'stop'
  | 'play'
  | 'action'
  | 'caret'
export type AutonomyButtonSize = 32 | 'auto'

export interface AutonomyButtonProps {
  icon?: IconName
  label?: string
  tooltip?: string
  onClick?: () => void
  ariaLabel: string
  variant?: AutonomyButtonVariant
  size?: AutonomyButtonSize
  flex?: boolean
  buttonStyle?: string
  iconRotation?: 'rotate-90' | 'rotate-180' | 'rotate-270' | ''
  disabled?: boolean
}

const variantClasses: Record<AutonomyButtonVariant, string> = {
  default: 'bg-transparent hover:bg-transparent',
  play: 'bg-[#0066CC] hover:bg-[#005bb5]',
  stop: 'bg-[#941920] hover:bg-[#7a1620]',
  action: 'bg-[#222222] hover:bg-[#444444]',
  caret: 'bg-transparent hover:bg-[#3A3A3A]',
}

export const AutonomyButton: React.FC<AutonomyButtonProps> = ({
  icon,
  label,
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
  const IconComponent = useMemo(
    () => (icon ? (Icons[icon] as IconComponentType) : null),
    [icon]
  )
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)

  if (icon && !IconComponent) {
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
        className={`inline-flex items-center justify-center relative
          ${size === 32 ? 'w-8 h-8' : 'w-auto h-8'}
          rounded-[2px]
          transition-all duration-500 ease-in-out
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
        {icon && IconComponent && (
          <span className={iconRotation}>
        <IconComponent
          width={16}
          height={16}
          className="pointer-events-none"
        />
          </span>
        )}
        {label && (
          <span
        className={`font-sans font-normal text-[14px] leading-5 text-white select-none ${
          icon ? 'ml-2' : ''
        }`}>
        {label}
          </span>
        )}
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

export default AutonomyButton
