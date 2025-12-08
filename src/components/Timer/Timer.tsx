import { useTimer } from '../../hooks'
import { formatTime } from '../../utils'

export interface TimerProps {
  duration: number
  progress?: number
  condensed?: boolean
  state?: 'running' | 'paused'
  onComplete?: () => void
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  progress: progressOverride,
  condensed = false,
  state = 'running',
  onComplete,
}) => {
  const { remaining, progress } = useTimer({
    duration: Math.max(0, duration),
    state,
    onComplete,
    progressOverride,
  })

  const size = 32
  const strokeWidth = 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progressOffset =
    circumference * (1 - Math.max(0, Math.min(1, progress)))

  const ringColor =
    state === 'paused'
      ? '#666666'
      : progress <= 0.1
      ? '#ff3b30'
      : progress <= 0.5
      ? '#ffd600'
      : '#fff'
  const display = formatTime(remaining)
  // Increase font size for 5+ char displays by 1px
  const fontSize = display.length >= 5 ? 7.5 : display.length === 4 ? 3 : 13
  const fontScale =
    display.length >= 5 ? 0.25 : display.length === 4 ? 0.29 : 0.42

  return (
    <div className="relative flex items-center justify-center w-8 h-8">
      <svg
        width={size}
        height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
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
          className="absolute inset-0 flex items-center justify-center font-sans font-bold text-white text-center select-none"
          style={{
            fontSize: `clamp(${fontSize}px, ${size * fontScale}px, 16px)`,
            lineHeight: '10px',
          }}
          role="timer"
          aria-live="polite">
          {display}
        </span>
      )}
    </div>
  )
}
