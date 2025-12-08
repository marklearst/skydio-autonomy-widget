import React, { useState, useEffect } from 'react'
import { Timer } from '../Timer'
import { ActionButton } from '../ActionButton'
import { ActionControls } from '../ActionControls'
import { StatusMessage } from '../StatusMessage'
import { useBreakpoint } from '../../hooks'

import type { ActionButtonProps } from '../ActionButton/ActionButton'

export interface ActionWidgetProps {
  actionName: string
  time: number
  expanded?: boolean
  isPaused?: boolean
  onPauseChange?: (paused: boolean) => void
  onActionNameChange?: (actionName: string) => void
  buttons?: Omit<ActionButtonProps, 'flex'>[]
}

export const ActionWidget: React.FC<ActionWidgetProps> = ({
  actionName,
  time,
  expanded: expandedProp,
  isPaused: isPausedProp,
  onPauseChange,
  onActionNameChange,
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
      if (onActionNameChange) {
        onActionNameChange(!isPausedProp ? 'Mission Paused' : actionName)
      }
    } else {
      setInternalPaused((prev) => {
        const next = !prev
        if (next && onActionNameChange) setInternalActionName('Mission Paused')
        else if (onActionNameChange) setInternalActionName(actionName)
        return next
      })
    }
  }

  return (
    <div
      className={`action-widget-base ${
        expanded && !isCompact ? 'h-[88px]' : 'h-[48px]'
      } ${isCompact && '!w-[88px]'} bg-gray-900 text-white`}>
      {isCompact ? (
        <div className="flex items-center gap-2 px-2 py-2">
          <Timer
            duration={time}
            state={isPaused ? 'paused' : 'running'}
          />
          <ActionButton
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
              <ActionButton
                icon="CaretIcon"
                tooltip={expanded ? 'Collapse Controls' : 'View Controls'}
                variant="caret"
                iconRotation={expanded ? 'rotate-180' : ''}
                ariaLabel={expanded ? 'Collapse' : 'Expand'}
                onClick={() => setExpanded((prev) => !prev)}
                size={32}
              />
              <ActionButton
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
              <ActionControls buttons={buttons} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
