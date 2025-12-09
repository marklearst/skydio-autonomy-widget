import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Props for the Tooltip component.
 * @property targetRect - The DOMRect of the target element
 * @property children - The tooltip content
 * @property visible - Whether the tooltip is visible
 * @property className - Additional CSS classes for the tooltip container
 */
interface TooltipProps {
  targetRect: DOMRect | null
  children: React.ReactNode
  visible: boolean
  className?: string
}

/**
 * Tooltip displays contextual information when hovering or focusing on a target element.
 *
 * @param {TooltipProps} props - The properties for configuring the tooltip.
 * @returns {JSX.Element | null} The rendered tooltip or null if not visible.
 *
 * @remarks
 * - Positions itself relative to the targetRect.
 * - Uses a portal for rendering above other content.
 * - Used for accessibility and UX enhancement.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  targetRect,
  children,
  visible,
  className = '',
}) => {
  const [style, setStyle] = useState<React.CSSProperties | null>(null)

  useEffect(() => {
    if (targetRect && visible) {
      setStyle({
        position: 'fixed',
        top: targetRect.bottom + 14,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translate(-50%, 0)',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 1,
        transition: 'opacity 0.15s ease-in-out',
      })
    } else {
      setStyle(null)
    }
  }, [targetRect, visible]) // Added targetRect to dependencies

  if (!visible || !style || typeof document === 'undefined') return null

  return createPortal(
    <div
      className={`bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap ${className}`}
      style={style}
      role="tooltip"
      aria-hidden={!visible}>
      {children}
    </div>,
    document.body
  )
}
