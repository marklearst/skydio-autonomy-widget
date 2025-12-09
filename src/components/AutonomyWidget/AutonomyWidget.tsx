import React, { useState, useEffect } from 'react'
import { Timer, AutonomyButton, Controls, StatusMessage } from 'components'
import { useBreakpoint } from 'hooks'

import type { AutonomyButtonProps } from 'components'

/**
 * Props for the AutonomyWidget component.
 * @property actionName - Name of the current mission action
 * @property time - Remaining or elapsed time (seconds)
 * @property expanded - Whether the widget is expanded
 * @property isPaused - Whether the mission is paused
 * @property onPauseChange - Callback for pause state changes
 * @property onNameChange - Callback for action name changes
 * @property buttons - List of button configurations (see AutonomyButtonProps)
 */
export interface AutonomyWidgetProps {
  actionName: string
  time: number
  expanded?: boolean
  isPaused?: boolean
  onPauseChange?: (paused: boolean) => void
  onNameChange?: (actionName: string) => void
  buttons?: Omit<AutonomyButtonProps, 'flex'>[]
}

/**
 * AutonomyWidget is a UI component for displaying mission controls, action name, timer, and status.
 *
 * @param {AutonomyWidgetProps} props - The properties for configuring the widget.
 * @returns {JSX.Element} The rendered autonomy widget component.
 *
 * @remarks
 * - Provides mission control buttons, timer, and status display.
 * - Supports expanded/collapsed and paused states.
 * - Designed for autonomy-related UIs.
 */
export const AutonomyWidget: React.FC<AutonomyWidgetProps> = ({
  actionName,
  time,
  expanded: expandedProp,
  isPaused: isPausedProp,
  onPauseChange,
  onNameChange,
  buttons,
}) => {
  const [expanded, setExpanded] = useState(expandedProp ?? false)
  const [internalPaused, setInternalPaused] = useState(isPausedProp ?? false)
  const [internalActionName, setInternalActionName] = useState(actionName)

  useEffect(() => {
    setInternalPaused(isPausedProp ?? false)
  }, [isPausedProp])

  useEffect(() => {
    setInternalActionName(actionName)
  }, [actionName])

  const isPaused = isPausedProp !== undefined ? isPausedProp : internalPaused
  const currentActionName = isPaused ? 'Mission Paused' : internalActionName
  const isCompact = useBreakpoint(1280)

  const handlePauseToggle = () => {
    if (isPausedProp !== undefined && onPauseChange) {
      onPauseChange(!isPausedProp)
      if (onNameChange) {
        onNameChange(!isPausedProp ? 'Mission Paused' : actionName)
      }
    } else {
      setInternalPaused((prev: boolean) => {
        const next = !prev
        if (next && onNameChange) setInternalActionName('Mission Paused')
        else if (onNameChange) setInternalActionName(actionName)
        return next
      })
    }
  }

  return (
    <div
      className={`autonomy-widget-base ${
        expanded && !isCompact ? 'h-[88px]' : 'h-[48px]'
      } ${isCompact && '!w-[88px]'} bg-gray-900 text-white`}>
      {isCompact ? (
        <div className="flex items-center gap-2 px-2 py-2">
          <Timer
            duration={time}
            state={isPaused ? 'paused' : 'running'}
          />
          <AutonomyButton
            icon={isPaused ? 'PlayIcon' : 'StopIcon'}
            variant={isPaused ? 'play' : 'stop'}
            tooltip={isPaused ? 'Resume Mission' : 'Pause Mission'}
            ariaLabel={isPaused ? 'Resume' : 'Pause'}
            onClick={handlePauseToggle}
            size={32}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full px-2 py-2">
            <div className="flex items-center gap-2">
              <Timer
                duration={time}
                state={isPaused ? 'paused' : 'running'}
              />
              <StatusMessage message={currentActionName} />
            </div>
            <div className="flex items-center gap-2">
              <AutonomyButton
                icon="CaretIcon"
                tooltip={expanded ? 'Collapse Controls' : 'View Controls'}
                variant="caret"
                iconRotation={expanded ? 'rotate-180' : ''}
                ariaLabel={expanded ? 'Collapse' : 'Expand'}
                onClick={() => setExpanded((prev) => !prev)}
                size={32}
              />
              <AutonomyButton
                icon={isPaused ? 'PlayIcon' : 'StopIcon'}
                variant={isPaused ? 'play' : 'stop'}
                tooltip={isPaused ? 'Resume Mission' : 'Pause Mission'}
                ariaLabel={isPaused ? 'Resume' : 'Pause'}
                onClick={handlePauseToggle}
                size={32}
              />
            </div>
          </div>
          {expanded && (
            <div className="px-2 w-full">
              <Controls buttons={buttons} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
