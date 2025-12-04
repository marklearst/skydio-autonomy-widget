import { useState, useEffect } from 'react'
import Timer from '../Timer/Timer'
import { IconButton } from '../IconButton/IconButton'
import ActionControls from '../ActionControls/ActionControls'
import StatusMessage from '../StatusMessage/StatusMessage'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export interface ActionWidgetProps {
  actionName: string
  time: number
  expanded?: boolean
  isPaused?: boolean
  onPauseChange?: (paused: boolean) => void
  onActionNameChange?: (actionName: string) => void
}

const ActionWidget: React.FC<ActionWidgetProps> = ({
  actionName,
  time,
  expanded: expandedProp,
  isPaused: isPausedProp,
  onPauseChange,
  onActionNameChange,
}) => {
  const [expanded, setExpanded] = useState(expandedProp ?? false)
  const [internalPaused, setInternalPaused] = useState(isPausedProp ?? false)
  const [internalActionName, setInternalActionName] = useState(actionName)

  const isCompact = useBreakpoint(1280)

  useEffect(() => {
    setInternalPaused(isPausedProp ?? false)
  }, [isPausedProp])

  useEffect(() => {
    setInternalActionName(actionName)
  }, [actionName])

  const isPaused = isPausedProp !== undefined ? isPausedProp : internalPaused
  const currentActionName = isPaused ? 'Mission Paused' : internalActionName

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
        isCompact
          ? '!h-[48px] !w-[88px] inline-flex'
          : expanded
          ? 'h-[48px] w-full'
          : 'h-[48px] w-full'
      }`}>
      {isCompact ? (
        <div className="flex items-center gap-2 px-2 py-2">
          <Timer
            duration={time}
            state={isPaused ? 'paused' : 'running'}
          />
          <IconButton
            tooltip={isPaused ? 'Resume Mission' : 'Pause Mission'}
            icon={isPaused ? 'PlayIcon' : 'StopIcon'}
            ariaLabel={isPaused ? 'Play' : 'Pause'}
            onClick={handlePauseToggle}
            variant={isPaused ? 'play' : 'stop'}
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
              <IconButton
                icon="CaretIcon"
                tooltip={expanded ? 'Collapse Controls' : 'View Controls'}
                ariaLabel={expanded ? 'Collapse controls' : 'Expand controls'}
                onClick={() => setExpanded((prev) => !prev)}
                variant="caret"
                buttonStyle="transform transition-transform"
                iconRotation={expanded ? 'rotate-180' : ''}
                size={32}
              />
              <IconButton
                tooltip={isPaused ? 'Resume Mission' : 'Pause Mission'}
                icon={isPaused ? 'PlayIcon' : 'StopIcon'}
                ariaLabel={isPaused ? 'Play' : 'Pause'}
                onClick={handlePauseToggle}
                variant={isPaused ? 'play' : 'stop'}
                size={32}
              />
            </div>
          </div>
          {expanded && (
            <div className="px-2 w-full">
              <ActionControls />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ActionWidget
