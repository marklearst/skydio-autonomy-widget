export interface StatusMessageProps {
  message: string
  className?: string
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  className = '',
}) => (
  <div
    className={`text-white font-sans font-semibold text-sm leading-5 truncate max-w-[107px] ${className}`}
    role="status"
    aria-live="polite">
    {message}
  </div>
)
