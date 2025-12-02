import { useEffect, useRef, useState, useCallback } from 'react'

export interface UseTimerOptions {
  duration?: number
  state?: 'running' | 'paused'
  onComplete?: () => void
  progressOverride?: number
}

export function useTimer({
  duration,
  state = 'running',
  onComplete,
  progressOverride,
}: UseTimerOptions) {
  const [remaining, setRemaining] = useState(duration ?? 0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sync duration prop
  useEffect(() => {
    if (typeof duration === 'number') {
      setRemaining(duration)
    }
  }, [duration])

  // Countdown effect
  useEffect(() => {
    if (state === 'running' && typeof duration === 'number' && remaining > 0) {
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
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [state, duration, onComplete, remaining])

  // Progress calculation (remaining / duration, clamped 0-1)
  let progress = 1
  if (typeof duration === 'number' && duration > 0) {
    progress = remaining / duration
  }
  if (typeof progressOverride === 'number') {
    progress = progressOverride
  }
  progress = Math.max(0, Math.min(1, progress))

  // Reset timer
  const reset = useCallback(() => {
    setRemaining(duration ?? 0)
  }, [duration])

  return {
    remaining,
    progress,
    reset,
    setRemaining,
  }
}