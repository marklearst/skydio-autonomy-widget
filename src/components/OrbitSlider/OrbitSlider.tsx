import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { HTMLAttributes } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { Icons } from '../../assets/icons'
import { useMotionTokens } from '../../hooks/useMotionTokens'

const { ChevronsLeftIcon, ChevronsRightIcon } = Icons
const finiteOr = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback
const percent = (value: number) => Math.min(100, Math.max(0, value))

/** A button-operated orbit progress control. The track is a display, not a draggable slider. */
export interface OrbitSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Lower progress limit, normalized to 0–100. @defaultValue 0 */
  min?: number
  /** Upper progress limit, normalized to 0–100. @defaultValue 100 */
  max?: number
  /** Positive adjustment size. @defaultValue 1 */
  step?: number
  /** Controlled progress percentage. Pair with `onChange`. */
  value?: number
  /** Initial progress for an uncontrolled instance. @defaultValue 50 */
  defaultValue?: number
  /** Legacy input: initializes and resynchronizes an uncontrolled instance. Prefer `value` for controlled use. */
  progress?: number
  /** Receives the next bounded percentage after an enabled caret is activated. */
  onChange?: (value: number) => void
  /** Prevent both adjustments. @defaultValue false */
  disabled?: boolean
}

export const OrbitSlider = forwardRef<HTMLDivElement, OrbitSliderProps>(function OrbitSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  progress,
  onChange,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Orbit progress controls',
  ...props
}, ref) {
  const normalizedMin = percent(finiteOr(min, 0))
  const normalizedMax = percent(finiteOr(max, 100))
  const lower = Math.min(normalizedMin, normalizedMax)
  const upper = Math.max(normalizedMin, normalizedMax)
  const increment = Number.isFinite(step) && step > 0 ? step : 1
  const clamp = useCallback((next: number) =>
    Math.min(upper, Math.max(lower, finiteOr(next, 50))), [lower, upper])
  const [internalProgress, setInternalProgress] = useState(() => clamp(defaultValue ?? progress ?? 50))
  const descriptionId = useId()
  const reducedMotion = useReducedMotion()
  const timing = useMotionTokens()
  const requested = useRef<{ value: number; immediate: boolean } | null>(null)

  useEffect(() => {
    if (value === undefined) {
      if (progress !== undefined) setInternalProgress(clamp(progress))
      else setInternalProgress(previous => clamp(previous))
    }
  }, [clamp, progress, value])

  const current = clamp(value ?? internalProgress)
  const visualProgress = useMotionValue(current)
  const thumbPosition = useTransform(visualProgress, next => `${next}%`)
  const fillScale = useTransform(visualProgress, next => (next - 50) / 100)

  useEffect(() => {
    const immediate = requested.current?.value === current && requested.current.immediate
    requested.current = null
    if (reducedMotion || immediate || !timing.feedback) {
      visualProgress.jump(current)
      return
    }
    const animation = animate(visualProgress, current, { type: 'spring', duration: timing.feedback, bounce: 0 })
    return () => animation.stop()
  }, [current, reducedMotion, timing.feedback, visualProgress])

  const update = (next: number, immediate: boolean) => {
    const bounded = clamp(next)
    if (bounded === current) return
    requested.current = { value: bounded, immediate }
    if (value === undefined) setInternalProgress(bounded)
    onChange?.(bounded)
  }

  return (
    <div {...props} ref={ref} role="group" aria-label={ariaLabel} className={`w-full ${className}`}>
      <output id={descriptionId} className="sr-only" aria-live="polite">{current}% orbit progress</output>
      <div className="flex flex-row gap-3 items-center justify-center">
        <button
          type="button"
          onClick={event => update(current - increment, event.detail === 0)}
          disabled={disabled || current <= lower}
          className="orbit-control shrink-0 flex items-center justify-center"
          aria-label="Decrease orbit progress"
          aria-describedby={descriptionId}>
          <ChevronsLeftIcon width={16} height={16} aria-hidden="true" />
        </button>

        <div
          role="meter"
          aria-label="Orbit progress"
          aria-valuemin={lower}
          aria-valuemax={upper}
          aria-valuenow={current}
          aria-valuetext={`${current}%`}
          className="basis-0 grow h-8 min-w-0 relative">
          <div className="absolute bg-border-control h-1 inset-x-0 rounded-full top-1/2 -translate-y-1/2" />
          <motion.div
            className="absolute h-1 bg-orbit-progress rounded-full top-1/2 -translate-y-1/2"
            style={{ left: '50%', width: '100%', scaleX: fillScale, originX: 0 }}
          />
          <div className="absolute size-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orbit-progress rounded-full" />
          <motion.div className="orbit-indicator absolute inset-x-0 top-1/2 pointer-events-none" style={{ x: thumbPosition }}>
            <div className="absolute size-6 -translate-x-1/2 -translate-y-1/2 bg-surface rounded-full border-4 border-orbit-progress" />
          </motion.div>
        </div>

        <button
          type="button"
          onClick={event => update(current + increment, event.detail === 0)}
          disabled={disabled || current >= upper}
          className="orbit-control shrink-0 flex items-center justify-center"
          aria-label="Increase orbit progress"
          aria-describedby={descriptionId}>
          <ChevronsRightIcon width={16} height={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
})
