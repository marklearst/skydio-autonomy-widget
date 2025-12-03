import { useState, useEffect } from 'react'
import Timer from '../Timer/Timer'
import { IconButton } from '../IconButton/IconButton'
import ActionControls from '../ActionControls/ActionControls'
import StatusMessage from '../StatusMessage/StatusMessage'

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
  // Local state for expand/collapse
  const [expanded, setExpanded] = useState(expandedProp ?? false)
  const [internalPaused, setInternalPaused] = useState(isPausedProp ?? false)
  const [internalActionName, setInternalActionName] = useState(actionName)

  // Sync internal state with props for Storybook/controlled usage
  useEffect(() => {
    setInternalPaused(isPausedProp ?? false)
  }, [isPausedProp])
  useEffect(() => {
    setInternalActionName(actionName)
  }, [actionName])

  // Controlled or uncontrolled
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
    <div className={`action-widget-base ${expanded ? 'h-[88px]' : 'h-[48px]'}`}>
      {/* Top row: left/right groups */}
      <div className="flex justify-between items-center w-full px-2 py-2">
        {/* Left group */}
        <div className="flex items-center gap-2">
          <Timer
            duration={time}
            state={isPaused ? 'paused' : 'running'}
          />
          <StatusMessage message={currentActionName} />
        </div>
        {/* Right group */}
        <div className="flex items-center gap-2">
          <IconButton
            icon="CaretIcon"
            ariaLabel={expanded ? 'Collapse controls' : 'Expand controls'}
            onClick={() => setExpanded((prev) => !prev)}
            className={`transition-transform ${expanded ? '' : 'rotate-180'}`}
            variant="default"
            size={32}
          />
          <IconButton
            icon={isPaused ? 'PlayIcon' : 'StopIcon'}
            ariaLabel={isPaused ? 'Play' : 'Pause'}
            onClick={handlePauseToggle}
            variant={isPaused ? 'play' : 'stop'}
            size={32}
          />
        </div>
      </div>
      {/* Action Controls Row */}
      {expanded && (
        <div className="px-2 w-full">
          <ActionControls />
        </div>
      )}
    </div>
  )
}

export default ActionWidget
