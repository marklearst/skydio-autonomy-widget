import Timer from "../Timer";
import IconButton from "../IconButton";
import ActionControls from "../ActionControls";

export interface ActionWidgetProps {
  actionName: string;
  time: string;
  isPaused?: boolean;
  expanded?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onExpand?: () => void;
  onCollapse?: () => void;
}

const ActionWidget: React.FC<ActionWidgetProps> = ({
  actionName,
  time,
  isPaused = false,
  expanded = false,
  onPause = () => {},
  // onResume = () => {},
  // onExpand = () => {},
  // onCollapse = () => {},
}) => {
  return (
    <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-4 shadow-lg">
      <IconButton icon='PauseIcon' onClick={onPause} ariaLabel="Pause" />
      <Timer time={time} state={isPaused ? "paused" : "running"} />
      <span className="text-white font-semibold text-lg flex-1">{actionName}</span>
      {/* TODO: Add expand/collapse button and Pause/Resume/Stop buttons */}
      {expanded && <ActionControls />}
    </div>
  );
};

export default ActionWidget;
