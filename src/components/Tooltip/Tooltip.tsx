import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type RefObject, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** Geometry-driven help, portaled above component clipping boundaries. */
export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger bounds in viewport coordinates. */
  targetRect: DOMRect | null
  /** Content may be plain text or short formatted help. */
  children: ReactNode
  /** Whether the trigger requests the tooltip. Escape dismisses until the next request. */
  visible: boolean
  /** Optional live anchor to refresh positioning during scroll and resize. */
  anchorRef?: RefObject<HTMLElement | null>
  /** Notifies a controlled trigger when Escape dismisses the tooltip. */
  onDismiss?: () => void
}

/** Non-interactive help. Give its ID to the trigger's `aria-describedby` while visible. */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip({
  targetRect,
  children,
  visible,
  className = '',
  anchorRef,
  onDismiss,
  style: customStyle,
  ...nativeProps
}, forwardedRef) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [dismissed, setDismissed] = useState(false)
  const [position, setPosition] = useState<CSSProperties | null>(null)
  const setRef = useCallback((node: HTMLDivElement | null) => {
    tooltipRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }, [forwardedRef])

  useEffect(() => {
    if (!visible) setDismissed(false)
  }, [visible])

  useLayoutEffect(() => {
    if (!visible || dismissed || !targetRect) {
      setPosition(null)
      return
    }
    const place = () => {
      const rect = anchorRef?.current?.getBoundingClientRect() || targetRect
      const tip = tooltipRef.current
      const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tooltip-gap')) || 14
      const height = tip?.offsetHeight || 0
      const width = tip?.offsetWidth || 0
      const center = rect.left + rect.width / 2
      const padding = 8
      const left = width ? Math.max(width / 2 + padding, Math.min(center, window.innerWidth - width / 2 - padding)) : center
      const below = rect.bottom + gap
      const top = height && below + height > window.innerHeight - padding
        ? Math.max(padding, rect.top - height - gap)
        : below
      setPosition({ position: 'fixed', top, left, transform: 'translateX(-50%)' })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [targetRect, visible, dismissed, anchorRef, children])

  useEffect(() => {
    if (!visible || dismissed) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.key !== 'Escape') return
      setDismissed(true)
      onDismiss?.()
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [visible, dismissed, onDismiss])

  if (!visible || dismissed || !targetRect || typeof document === 'undefined') return null

  return createPortal(
    <div
      {...nativeProps}
      ref={setRef}
      role="tooltip"
      className={`widget-tooltip ${className}`.trim()}
      style={{ ...position, ...customStyle }}>
      {children}
    </div>,
    document.body
  )
})
