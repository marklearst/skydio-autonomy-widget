import { useState } from 'react'
import Timer from '../Timer/Timer'
import { IconButton } from '../IconButton/IconButton'
import ActionControls from '../ActionControls/ActionControls'
import StatusMessage from '../StatusMessage/StatusMessage'

export interface ActionWidgetProps {
  actionName: string
  time: number
  expanded?: boolean
  onExpand?: () => void
  onCollapse?: () => void
}

const ActionWidget: React.FC<ActionWidgetProps> = ({
  actionName,
  time,
  // Remove isPaused, onPause, onResume from props if not needed externally
}) => {
  // Local state for expand/collapse
  const [expanded, setExpanded] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

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
          <StatusMessage message={actionName} />
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
            onClick={() => setIsPaused((prev) => !prev)}
            variant={isPaused ? 'play' : 'stop'}
            size={32}
          />
        </div>
      </div>
      {/* Action Controls Row */}
      {expanded && (
        <div className="mt-2 px-2 pb-2 w-full">
          <ActionControls />
        </div>
      )}
    </div>
  )
}

export default ActionWidget
