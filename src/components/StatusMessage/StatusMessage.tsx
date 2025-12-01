export interface StatusMessageProps {
  message: string
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => (
  <div className="flex items-center gap-2 bg-gray-900 p-2">{message}</div>
)

export default StatusMessage
