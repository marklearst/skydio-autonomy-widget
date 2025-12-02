export interface StatusMessageProps {
  message: string
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => (
  <div className="font-sf font-semibold text-sm leading-5 text-white">
    {message}
  </div>
)

export default StatusMessage
