import React, { useRef, useState, useMemo } from 'react'
import * as Icons from 'icons'
import type { IconName, IconComponentType } from 'icons'
import { Tooltip } from 'components'

/**
 * Button variant options for AutonomyButton.
 * - 'default': Transparent button
 * - 'stop': Red button for stop actions
 * - 'play': Blue button for play/resume actions
 * - 'action': Gray button for mission actions
 * - 'caret': Caret/expand/collapse button
 */
export type AutonomyButtonVariant =
  | 'default'
  | 'stop'
  | 'play'
  | 'action'
  | 'caret'

/**
 * Supported sizes for AutonomyButton.
 * - 32: Standard icon button size
 * - 'auto': Flexible width for label buttons
 */
export type AutonomyButtonSize = 32 | 'auto'

/**
 * Props for the AutonomyButton component.
 * @property icon - Name of the icon to display (from icons barrel)
 * @property label - Optional label text to display next to the icon
 * @property tooltip - Tooltip text shown on hover
 * @property onClick - Click handler for the button
 * @property ariaLabel - Accessibility label for screen readers
 * @property variant - Button style variant
 * @property size - Button size (32 or 'auto')
 * @property flex - Whether the button should flex-grow
 * @property buttonStyle - Custom style classes for the button
 * @property iconRotation - Icon rotation class (for caret/arrow icons)
 * @property disabled - Whether the button is disabled
 */
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

// Define variant styles for the button
// These classes can be customized in your CSS
// or Tailwind config to match your design system
// They provide visual feedback for different button states
// such as hover effects and background colors
// Each variant corresponds to a specific action or state
const variantClasses: Record<AutonomyButtonVariant, string> = {
  default: 'bg-transparent hover:bg-transparent',
  play: 'bg-[#0066CC] hover:bg-[#005bb5]',
  stop: 'bg-[#941920] hover:bg-[#7a1620]',
  action: 'bg-[#222222] hover:bg-[#444444]',
  caret: 'bg-transparent hover:bg-[#3A3A3A]',
}

/**
 * `AutonomyButton` is a customizable React button component designed for use in autonomy-related UI controls.
 * It supports displaying an icon, label, and tooltip, and provides accessibility features.
 *
 * @param {AutonomyButtonProps} props - The properties for configuring the button.
 * @returns {JSX.Element} The rendered autonomy button component.
 *
 * @remarks
 * - If the specified icon is not found, a warning icon and message are displayed.
 * - Tooltip is shown when the button is hovered or focused.
 * - Accessibility and keyboard navigation are supported.
 */
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

  /**
   * Handles the mouse enter event for the autonomy button.
   *
   * - If the button's DOM reference exists and the bounding rectangle (`rect`) is not set,
   *   it retrieves the button's bounding rectangle and updates the state.
   * - Sets the hovered state to `true`.
   */
  const handleMouseEnter = () => {
    if (buttonRef.current && !rect) {
      setRect(buttonRef.current.getBoundingClientRect())
    }
    setHovered(true)
  }

  /**
   * Handles the mouse leave event for the autonomy button.
   * Sets the hovered state to false when the mouse leaves the button area.
   */
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
