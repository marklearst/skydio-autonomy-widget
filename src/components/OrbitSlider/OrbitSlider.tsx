import React, { useState, useEffect } from 'react'
import { Icons } from '../../assets/icons'

const { ChevronsLeftIcon, ChevronsRightIcon } = Icons

interface OrbitSliderProps {
  /** Minimum progress (0-100) */
  min?: number
  /** Maximum progress (0-100) */
  max?: number
  /** Step size for adjustments */
  step?: number
  /** Callback when progress changes */
  onChange?: (value: number) => void
  /** Whether the slider is disabled */
  disabled?: boolean
  /** Orbit progress (0-100) - how far through the orbit */
  progress?: number
}

export const OrbitSlider: React.FC<OrbitSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  progress = 50, // Default to 50% through orbit
}) => {
  const [internalProgress, setInternalProgress] = useState(progress)

  // Sync internal state with prop changes (for Storybook controls)
  useEffect(() => {
    setInternalProgress(progress)
  }, [progress])

  // Orbit progress position (big blue circle)
  const progressPercentage = Math.min(100, Math.max(0, internalProgress))

  const decreaseProgress = () => {
    const newValue = Math.max(min, internalProgress - step)
    setInternalProgress(newValue)
    onChange?.(newValue)
  }

  const increaseProgress = () => {
    const newValue = Math.min(max, internalProgress + step)
    setInternalProgress(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="w-full">
      {/* Exact Figma structure: flex flex-row gap-3 items-center */}
      <div className="flex flex-row gap-3 items-center justify-center">
        {/* Left chevrons - size-4 (16px) */}
        <button
          onClick={decreaseProgress}
          disabled={disabled || internalProgress <= min}
          className="relative shrink-0 size-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          aria-label="Decrease orbit progress">
          <ChevronsLeftIcon className="size-full text-white" />
        </button>

        {/* Track container - basis-0 grow h-8 */}
        <div className="basis-0 grow h-8 min-h-px min-w-px relative shrink-0">
          {/* Background track - h-1 bg-[#4d4d4d] rounded-[5px] */}
          <div className="absolute bg-[#4d4d4d] h-1 left-0 right-0 rounded-[5px] top-1/2 translate-y-[-50%]" />

          {/* Progress line - connects reference point to drone position */}
          <div
            className="absolute h-1 bg-[#0077ee] rounded-[5px] top-1/2 translate-y-[-50%]"
            style={{
              left: progressPercentage >= 50 ? '50%' : `${progressPercentage}%`,
              width: `${Math.abs(progressPercentage - 50)}%`,
            }}
          />

          {/* Blue circle - orbit reference point (center/start) */}
          <div
            className="absolute size-3 top-1/2 translate-x-[-50%] translate-y-[-50%] z-10"
            style={{ left: '50%' }}>
            <div className="w-full h-full bg-[#0077ee] rounded-full" />
          </div>

          {/* Drone position indicator - current location in orbit */}
          <div
            className="absolute shadow-[0px_4px_10px_0px_rgba(0,0,0,0.2)] size-6 top-1/2 translate-x-[-50%] translate-y-[-50%] bg-[#1A1A1A] rounded-full border-4 border-[#0077ee] pointer-events-none z-10"
            style={{ left: `${progressPercentage}%` }}
          />
        </div>

        {/* Right chevrons - size-4 (16px) */}
        <button
          onClick={increaseProgress}
          disabled={disabled || internalProgress >= max}
          className="relative shrink-0 size-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          aria-label="Increase orbit progress">
          <ChevronsRightIcon className="size-full text-white" />
        </button>
      </div>
    </div>
  )
}
