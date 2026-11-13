import { forwardRef, type HTMLAttributes } from 'react'
import { Button } from '../Button/Button'
import type { ButtonProps } from '../Button/Button'

/**
 * Props for the Controls component.
 * @property buttons - Array of button configs (see ButtonProps)
 * @property className - Additional CSS classes for the controls container
 */
export interface ControlsProps extends HTMLAttributes<HTMLDivElement> {
  buttons?: Omit<ButtonProps, 'flex'>[]
  className?: string
}

const defaultButtons: Omit<ButtonProps, 'flex'>[] = [
  {
    icon: 'ArrowTurnDownLeftIcon',
    ariaLabel: 'Refresh waypoint',
    variant: 'action',
  },
  {
    icon: 'ChevronLeftIcon',
    ariaLabel: 'Previous waypoint',
    variant: 'action',
  },
  {
    icon: 'ChevronRightIcon',
    ariaLabel: 'Next waypoint',
    variant: 'action',
  },
  {
    icon: 'CameraViewfinderIcon',
    ariaLabel: 'Waypoint settings',
    variant: 'action',
  },
]

/**
 * Controls is a UI component for rendering a group of directional and action buttons.
 *
 * @param {ControlsProps} props - The properties for configuring the controls.
 * @returns {JSX.Element} The rendered controls component.
 *
 * @remarks
 * - Renders a set of default or custom buttons for mission control.
 * - Designed for use in autonomy or navigation UIs.
 */
export const Controls = forwardRef<HTMLDivElement, ControlsProps>(function Controls({
  buttons = defaultButtons,
  className = '',
  style,
  role = 'group',
  'aria-label': ariaLabel = 'Mission controls',
  ...nativeProps
}, ref) {
  return (
    <div
      {...nativeProps}
      ref={ref}
      className={`flex gap-2 ${className}`.trim()}
      style={{ minWidth: 50, ...style }}
      role={role}
      aria-label={ariaLabel}>
      {buttons.map((button, index) => (
        <Button
          key={button.id || `${button.ariaLabel || button['aria-label'] || button.label}-${index}`}
          {...button}
          flex
        />
      ))}
    </div>
  )
})
