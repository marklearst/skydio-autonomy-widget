import { useState } from 'react'
import Timer from '../Timer/Timer'
import { IconButton } from '../IconButton/IconButton'
import ActionControls from '../ActionControls/ActionControls'
import StatusMessage from '../StatusMessage/StatusMessage'

export interface ActionWidgetProps {
  actionName: string
  time: number
  isPaused?: boolean
  expanded?: boolean
  onPause?: () => void
  onResume?: () => void
  onExpand?: () => void
  onCollapse?: () => void
}

const ActionWidget: React.FC<ActionWidgetProps> = ({
  actionName,
  time,
  isPaused = false,
  onPause = () => {},
  onResume = () => {},
}) => {
  // Local state for expand/collapse
  const [expanded, setExpanded] = useState(false)

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
            ariaLabel={isPaused ? 'Resume' : 'Pause'}
            onClick={isPaused ? onResume : onPause}
            variant={isPaused ? 'stop' : 'play'}
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
