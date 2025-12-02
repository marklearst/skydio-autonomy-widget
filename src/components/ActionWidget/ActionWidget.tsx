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
  expanded = false,
  onPause = () => {},
  onResume = () => {},
  onExpand = () => {},
  onCollapse = () => {},
}) => {
  return (
    <div className="w-full max-w-[420px] bg-gray-900 rounded-xl shadow-lg p-4 flex flex-col items-stretch">
      {/* Top Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 min-w-[80px]">
          <Timer
            duration={time}
            state={isPaused ? 'paused' : 'running'}
          />
        </div>
        <div className="flex-1">
          <StatusMessage message={actionName} />
        </div>
        <IconButton
          icon={expanded ? 'CaretIcon' : 'CaretIcon'}
          ariaLabel={expanded ? 'Collapse controls' : 'Expand controls'}
          onClick={expanded ? onCollapse : onExpand}
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
      {/* Action Controls Row */}
      {expanded && (
        <div className="mt-3">
          <ActionControls />
        </div>
      )}
    </div>
  )
}

export default ActionWidget
