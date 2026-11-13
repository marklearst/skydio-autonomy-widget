import { useEffect, useRef, useState, useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'

/** Input to a bounded, local countdown. Durations are whole seconds. */
export interface UseTimerOptions {
  /** Initial duration, normalized to 0–3,599 seconds. @defaultValue 0 */
  duration?: number
  /** Pausing preserves remaining time. @defaultValue 'running' */
  state?: 'running' | 'paused'
  /** Called once when a positive running countdown reaches zero. */
  onComplete?: () => void
  /** Optional ring fraction; independent of remaining time. */
  progressOverride?: number
}

const normalizeSeconds = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(Math.floor(value), 3599)) : 0

/**
 * Counts down locally at one-second intervals. This is not a telemetry clock.
 *
 * @remarks
 * A changed effective duration restarts the countdown. `reset` starts a new
 * run at that duration, even after completion. Initializing or resetting at
 * zero does not emit completion. Callbacks run outside React state updaters,
 * so StrictMode cannot replay them as part of its purity checks.
 */
export function useTimer({
  duration = 0,
  state = 'running',
  onComplete,
  progressOverride,
}: UseTimerOptions) {
  const effectiveDuration = normalizeSeconds(duration)
  const [remaining, setRemainingState] = useState(effectiveDuration)
  const [resetVersion, setResetVersion] = useState(0)
  const remainingRef = useRef(effectiveDuration)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const completedRef = useRef(false)
  const previousDurationRef = useRef(effectiveDuration)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const setRemaining = useCallback<Dispatch<SetStateAction<number>>>((update) => {
    const value = typeof update === 'function' ? update(remainingRef.current) : update
    const next = normalizeSeconds(value)
    const resumesCompletedRun = remainingRef.current === 0 && next > 0
    remainingRef.current = next
    if (next > 0) completedRef.current = false
    setRemainingState(next)
    if (resumesCompletedRun) setResetVersion(version => version + 1)
  }, [])

  const reset = useCallback(() => {
    clearTick()
    completedRef.current = false
    remainingRef.current = effectiveDuration
    setRemainingState(effectiveDuration)
    setResetVersion((version) => version + 1)
  }, [clearTick, effectiveDuration])

  useEffect(() => {
    if (previousDurationRef.current !== effectiveDuration) {
      previousDurationRef.current = effectiveDuration
      reset()
    }
  }, [effectiveDuration, reset])

  const hasTimeRemaining = remaining > 0
  useEffect(() => {
    clearTick()
    if (state !== 'running' || remainingRef.current <= 0) return

    intervalRef.current = setInterval(() => {
      const next = Math.max(0, remainingRef.current - 1)
      remainingRef.current = next
      setRemainingState(next)
      if (next === 0) {
        clearTick()
        if (!completedRef.current) {
          completedRef.current = true
          onCompleteRef.current?.()
        }
      }
    }, 1000)

    return clearTick
  }, [state, effectiveDuration, hasTimeRemaining, resetVersion, clearTick])

  const timedProgress = effectiveDuration > 0 ? remaining / effectiveDuration : 1
  const progress = typeof progressOverride === 'number' && Number.isFinite(progressOverride)
    ? Math.max(0, Math.min(1, progressOverride))
    : Math.max(0, Math.min(1, timedProgress))

  return { remaining, progress, reset, setRemaining }
}
