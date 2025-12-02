import { IconButton } from '../IconButton'

const ActionControls: React.FC = () => (
  <div className="flex gap-2 mt-2 bg-gray-800 border border-gray-700 rounded px-3 py-2">
    <IconButton icon="ArrowTurnDownLeft" ariaLabel="Collapse" variant="default" size={32} />
    <IconButton icon="Caret" ariaLabel="Left" variant="default" size={32} className="rotate-180" />
    <IconButton icon="Caret" ariaLabel="Right" variant="default" size={32} />
    <IconButton icon="CameraViewfinder" ariaLabel="Camera" variant="default" size={32} />
  </div>
)

export default ActionControls
