/**
 * Props for the StatusMessage component.
 * @property message - The status message text to display
 * @property className - Additional CSS classes for the status message container
 */
export interface StatusMessageProps {
  message: string
  className?: string
}

/**
 * StatusMessage displays a status or feedback message in the UI.
 *
 * @param {StatusMessageProps} props - The properties for configuring the status message.
 * @returns {JSX.Element} The rendered status message component.
 *
 * @remarks
 * - Used for live status updates or feedback in autonomy UIs.
 * - Text spans available width and hides overflow without truncation ellipsis.
 */
export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  className = '',
}) => (
  <div
    className={`text-white font-sans font-semibold text-[13px] leading-5 overflow-hidden whitespace-nowrap ${className}`}
    role="status"
    aria-live="polite">
    {message}
  </div>
)
