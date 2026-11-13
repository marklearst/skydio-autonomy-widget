import { useEffect, useRef, useState } from 'react'
import type { ComponentType, CSSProperties } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTimer } from '../../hooks/useTimer'
import { useMotionTokens } from '../../hooks/useMotionTokens'
import { formatTime } from '../../utils/time'
import { Tooltip } from '../Tooltip/Tooltip'
import { useTooltipInteraction } from '../Tooltip/useTooltipInteraction'
import { RouteIcon } from '../../assets/icons'

/** Countdown input and presentation options. */
export interface TimerProps {
  /** Duration in whole seconds, bounded to 0–3,599. Changing the effective duration resets it. */
  duration: number
  /** Ring override from 0 (empty) to 1 (full); does not change countdown text. */
  progress?: number
  /** Show the icon immediately, including while paused or complete. @defaultValue false */
  condensed?: boolean
  /** Pause preserves remaining time. @defaultValue 'running' */
  state?: 'running' | 'paused'
  /** Mission icon component. @defaultValue RouteIcon */
  icon?: ComponentType<{ width?: number; height?: number; className?: string }>
  /** Help shown on hover or keyboard focus; Escape dismisses it. */
  tooltip?: string
  /** Called once when a positive running countdown reaches zero. */
  onComplete?: () => void
}

/**
 * Displays a local countdown and a mission icon in a fixed 32px ring.
 *
 * @remarks
 * Text is shown for the first six seconds of an active run, then replaced by
 * the icon. Pause and completion restore text unless `condensed` is set.
 * Reduced motion removes all animated transitions, including opacity fades.
 */
export const Timer = ({
  duration,
  progress: progressOverride,
  condensed = false,
  state = 'running',
  icon: IconComponent = RouteIcon,
  tooltip,
  onComplete,
}: TimerProps) => {
  const { remaining, progress } = useTimer({ duration, state, onComplete, progressOverride })
  const reducedMotion = useReducedMotion()
  const motionTiming = useMotionTokens()
  const isRunning = state === 'running' && remaining > 0
  const iconMode = `${duration}:${state}:${condensed}:${isRunning}`
  const [revealed, setRevealed] = useState({ mode: iconMode, visible: false })
  if (revealed.mode !== iconMode) setRevealed({ mode: iconMode, visible: false })
  const showIcon = revealed.mode === iconMode && revealed.visible

  useEffect(() => {
    if (condensed || !isRunning) return
    const timeout = setTimeout(() => setRevealed({ mode: iconMode, visible: true }), 6000)
    return () => clearTimeout(timeout)
  }, [iconMode, condensed, isRunning])

  const display = formatTime(remaining)
  const iconVisible = condensed || (isRunning && showIcon)
  const animateContent = !reducedMotion && isRunning && !condensed
  const size = 32
  const strokeWidth = 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const fontSize = display.length >= 5
    ? 'var(--font-size-timer-long)'
    : display.length === 4
      ? 'var(--font-size-timer-medium)'
      : 'var(--font-size-timer-short)'
  const contentStyle: CSSProperties = { fontSize, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }
  const content = iconVisible
    ? <IconComponent width={16} height={16} className="text-content-primary" />
    : display

  const timerElement = (
    <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
      <svg width={size} height={size} role="img" aria-label={`Timer: ${display} remaining`}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--color-timer-track)" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={state === 'paused' ? 'var(--color-timer-paused)' : 'var(--color-content-primary)'}
          strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!animateContent ? (
          <span
            key={iconVisible ? 'icon' : 'time'}
            className="flex items-center justify-center font-sans font-semibold text-content-primary"
            style={contentStyle}
            role={iconVisible ? undefined : 'timer'}
            aria-hidden={iconVisible || undefined}
            aria-live={iconVisible ? undefined : 'off'}>
            {content}
          </span>
        ) : (
          <AnimatePresence initial={false} mode="sync">
            <motion.span
              key={iconVisible ? 'icon' : 'time'}
              initial={{ opacity: 0, y: iconVisible ? 2 : -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: iconVisible ? -2 : 2, transition: { duration: motionTiming.fast } }}
              transition={{ duration: motionTiming.normal, ease: motionTiming.ease }}
              className="absolute flex items-center justify-center font-sans font-semibold text-content-primary"
              style={contentStyle}
              role={iconVisible ? undefined : 'timer'}
              aria-hidden={iconVisible || undefined}
              aria-live={iconVisible ? undefined : 'off'}>
              {content}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
    </div>
  )

  const triggerRef = useRef<HTMLDivElement>(null)
  const { tooltipId, isOpen, targetRect, dismiss, triggerProps, tooltipProps } = useTooltipInteraction({
    triggerRef,
    enabled: Boolean(tooltip),
  })

  if (!tooltip) return timerElement

  return (
    <>
      <div
        ref={triggerRef}
        tabIndex={0}
        aria-describedby={isOpen ? tooltipId : undefined}
        className="widget-timer-trigger inline-flex items-center justify-center shrink-0"
        style={{ width: 'var(--control-size)', height: 'var(--control-size)', borderRadius: 'var(--radius-button)' }}
        {...triggerProps}>
        {timerElement}
      </div>
      <Tooltip id={tooltipId} anchorRef={triggerRef} targetRect={targetRect} visible={isOpen} onDismiss={dismiss} {...tooltipProps}>
        {tooltip}
      </Tooltip>
    </>
  )
}
