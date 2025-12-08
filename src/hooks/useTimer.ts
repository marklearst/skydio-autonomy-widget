import { useEffect, useRef, useState, useCallback } from 'react'

export interface UseTimerOptions {
  duration?: number
  state?: 'running' | 'paused'
  onComplete?: () => void
  progressOverride?: number
}

export function useTimer({
  duration = 0,
  state = 'running',
  onComplete,
  progressOverride,
}: UseTimerOptions) {
  const [remaining, setRemaining] = useState(Math.max(0, duration))
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sync duration prop
  useEffect(() => {
    setRemaining(Math.max(0, duration))
  }, [duration])

  // Countdown effect
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (state === 'running' && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!)
            if (onComplete) onComplete()
            return 0
          }
          return r - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [state, remaining, onComplete])

  // Progress calculation
  let progress =
    duration > 0 ? Math.max(0, Math.min(1, remaining / duration)) : 1
  if (typeof progressOverride === 'number' && !isNaN(progressOverride)) {
    progress = Math.max(0, Math.min(1, progressOverride))
  }

  // Reset timer
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setRemaining(Math.max(0, duration))
  }, [duration])

  return {
    remaining,
    progress,
    reset,
    setRemaining,
  }
}
