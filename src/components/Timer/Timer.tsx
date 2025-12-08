import { useEffect, useState } from 'react'
import { useTimer } from '../../hooks'
import { formatTime } from '../../utils'
import { motion, AnimatePresence } from 'framer-motion'
import { RouteIcon } from '../../assets/icons' // Barrel import

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

  // Animation state: 'showTime', 'crossfade', 'showIcon'
  const [phase, setPhase] = useState<'showTime' | 'crossfade' | 'showIcon'>(
    'showTime'
  )
  // const [settled, setSettled] = useState(false)
  // const [firstLoad, setFirstLoad] = useState(true)

  const shouldForceTime = state === 'paused' || remaining <= 0

  useEffect(() => {
    if (shouldForceTime) {
      setPhase('showTime')
      // setSettled(false)
      return
    }

    let timeout: NodeJS.Timeout | undefined

    if (phase === 'showTime') {
      timeout = setTimeout(() => setPhase('crossfade'), 6000)
    } else if (phase === 'crossfade') {
      timeout = setTimeout(() => {
        setPhase('showIcon')
        // setSettled(true)
      }, 200)
    }

    return () => timeout && clearTimeout(timeout)
  }, [phase, shouldForceTime])

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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {phase === 'showTime' && (
              <motion.span
                key="time"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  opacity: { duration: 0.3, ease: 'easeInOut' },
                  y: { type: 'spring', stiffness: 200, damping: 28 },
                }}
                className="font-sans font-bold text-white text-center select-none absolute"
                style={{
                  fontSize: `clamp(${fontSize}px, ${size * fontScale}px, 16px)`,
                  lineHeight: '10px',
                }}
                role="timer"
                aria-live="polite">
                {display}
              </motion.span>
            )}
            {phase === 'showIcon' && (
              <motion.span
                key="icon"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex items-center justify-center absolute"
                style={{ width: 16, height: 16 }}
                aria-hidden="true">
                <RouteIcon
                  width={16}
                  height={16}
                  className="text-white"
                />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
