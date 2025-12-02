import { useEffect, useRef, useState } from 'react'

export interface TimerProps {
  duration?: number
  progress?: number // 0 to 1
  condensed?: boolean
  state?: 'running' | 'paused'
  onComplete?: () => void
}

const Timer: React.FC<TimerProps> = ({
  duration,
  progress: progressOverride,
  condensed = false,
  state = 'running',
  onComplete,
}) => {
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

  // Format seconds as mm:ss
  function formatTime(sec: number): string {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Progress calculation (remaining / duration, clamped 0-1)
  let progress = 1
  if (typeof duration === 'number' && duration > 0) {
    progress = remaining / duration
  }
  if (typeof progressOverride === 'number') {
    progress = progressOverride
  }
  progress = Math.max(0, Math.min(1, progress))

  // SVG constants
  const size = 32 // px
  const strokeWidth = 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  // The KEY: use (1 - progress) for offset to make the arc vanish counter-clockwise from the top
  const progressOffset = circumference * (1 - progress)

  // Color logic
  let ringColor = '#fff'
  if (state === 'paused') ringColor = '#666666'
  // else if (progress <= 0.1) ringColor = '#ff3b30'
  // else if (progress <= 0.5) ringColor = '#ffd600'

  const display = formatTime(remaining)

  const fontScale =
    display.length >= 5 ? 0.28 : display.length === 4 ? 0.34 : 0.42

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
      }}>
      <svg
        width={size}
        height={size}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress ring (depletes counter-clockwise from the top) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="butt"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {!condensed && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${size}px`,
            height: `${size}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'SF Pro Display, sans-serif',
            fontWeight: '700',
            fontSize: `clamp(9px, ${size * fontScale}px, 16px)`,
            lineHeight: '10px',
            color: '#fff',
            textAlign: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
          {display}
        </span>
      )}
    </div>
  )
}

export default Timer
