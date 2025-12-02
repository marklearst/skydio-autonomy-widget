export interface StatusMessageProps {
  message: string
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => (
  <div className="!text-white !font-sans !font-semibold text-[14px] leading-[20px] truncate overflow-ellipsis overflow-hidden whitespace-nowrap max-w-full">
    {message}
  </div>
)

export default StatusMessage
