import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
} from 'react'
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'framer-motion'
import * as Icons from 'icons'
import type { IconName, IconComponentType } from 'icons'
import { Tooltip } from '../Tooltip/Tooltip'
import { useTooltipInteraction } from '../Tooltip/useTooltipInteraction'
import { useMotionTokens } from '../../hooks/useMotionTokens'

/** The supported action treatments. Borderless variants retain the same semantic color. */
export type ButtonVariant =
  | 'default'
  | 'stop'
  | 'play'
  | 'action'
  | 'caret'
  | 'stop-borderless'
  | 'play-borderless'
  | 'caret-borderless'

/** A square control or a content-width control. Touch targets expand on coarse pointers. */
export type ButtonSize = 32 | 'auto'

/** Native button attributes are passed through; refs target the actual button. */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional icon from the shared SVG library. */
  icon?: IconName
  /** Visible text, or use native `children` for richer content. */
  label?: string
  /** Help text associated with the button while shown on hover or focus. */
  tooltip?: string
  /** Compatibility alias for native `aria-label`. Visible text can also name the button. */
  ariaLabel?: string
  /** Visual treatment. @defaultValue 'default' */
  variant?: ButtonVariant
  /** Fixed square or content width. @defaultValue 32 */
  size?: ButtonSize
  /** Share available width in a flex parent. @defaultValue false */
  flex?: boolean
}

/** Native action control with visible focus, disabled semantics, and dismissible help. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  icon,
  label,
  children,
  tooltip,
  ariaLabel,
  variant = 'default',
  size = 32,
  flex = false,
  disabled = false,
  type = 'button',
  className = '',
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  'aria-label': nativeAriaLabel,
  'aria-describedby': describedBy,
  ...nativeProps
}, forwardedRef) {
  const IconComponent = useMemo(
    () => (icon ? (Icons[icon] as IconComponentType) : null),
    [icon]
  )
  const buttonRef = useRef<HTMLButtonElement>(null)
  const present = useIsPresent()
  const reducedMotion = useReducedMotion()
  const timing = useMotionTokens()
  const help = useTooltipInteraction({ triggerRef: buttonRef, enabled: Boolean(tooltip && !disabled && present) })
  const tooltipVisible = help.isOpen

  const setRef = useCallback((node: HTMLButtonElement | null) => {
    buttonRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }, [forwardedRef])

  if (icon && !IconComponent) {
    console.error(`Icon "${icon}" not found in icons barrel.`)
    return <span aria-label={ariaLabel || nativeAriaLabel} className="text-action-pause">⚠️</span>
  }

  const content = children ?? label
  const helpIds = [describedBy, tooltipVisible ? help.tooltipId : undefined].filter(Boolean).join(' ') || undefined

  return (
    <>
      <button
        {...nativeProps}
        ref={setRef}
        type={type}
        disabled={disabled}
        className={`widget-button ${className}`.trim()}
        data-variant={variant}
        data-size={size}
        data-flex={flex}
        data-has-label={Boolean(content)}
        aria-label={ariaLabel || nativeAriaLabel}
        aria-describedby={helpIds}
        onMouseEnter={event => {
          onMouseEnter?.(event)
          if (!event.defaultPrevented) {
            help.triggerProps.onMouseEnter()
          }
        }}
        onMouseLeave={event => {
          onMouseLeave?.(event)
          if (!event.defaultPrevented) help.triggerProps.onMouseLeave()
        }}
        onFocus={event => {
          onFocus?.(event)
          if (!event.defaultPrevented) {
            help.triggerProps.onFocus()
          }
        }}
        onBlur={event => {
          onBlur?.(event)
          if (!event.defaultPrevented) help.triggerProps.onBlur()
        }}
        onKeyDown={event => {
          onKeyDown?.(event)
          if (!event.defaultPrevented) help.triggerProps.onKeyDown(event)
        }}>
        {IconComponent && (
          <span className="widget-button-icon relative inline-flex size-4 shrink-0 pointer-events-none" aria-hidden="true">
            {reducedMotion ? <IconComponent width={16} height={16} /> : (
              <AnimatePresence initial={false}>
                <motion.span
                  key={icon}
                  className="absolute inset-0 inline-flex items-center justify-center"
                  initial={{ opacity: 0, y: 2, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -2, scale: 0.9, transition: { duration: timing.fast } }}
                  transition={{ duration: timing.feedback, ease: timing.ease }}>
                  <IconComponent width={16} height={16} />
                </motion.span>
              </AnimatePresence>
            )}
          </span>
        )}
        {content && <span className="widget-button-label">{content}</span>}
      </button>
      {tooltip && help.targetRect && (
        <Tooltip
          {...help.tooltipProps}
          id={help.tooltipId}
          targetRect={help.targetRect}
          anchorRef={buttonRef}
          visible={tooltipVisible}
          onDismiss={help.dismiss}>
          {tooltip}
        </Tooltip>
      )}
    </>
  )
})
