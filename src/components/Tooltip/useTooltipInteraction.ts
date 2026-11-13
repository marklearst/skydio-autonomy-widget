import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from 'react'

interface TooltipInteractionOptions {
  triggerRef: RefObject<HTMLElement | null>
  enabled?: boolean
  /** Time to cross the space between a trigger and its floating help. */
  closeDelay?: number
}

/** Shared pointer/focus lifetime for non-focusable, hoverable tooltip content. */
export function useTooltipInteraction({ triggerRef, enabled = true, closeDelay = 200 }: TooltipInteractionOptions) {
  const tooltipId = useId()
  const [open, setOpen] = useState(false)
  const [previousEnabled, setPreviousEnabled] = useState(enabled)
  if (previousEnabled !== enabled) {
    setPreviousEnabled(enabled)
    if (!enabled) setOpen(false)
  }
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const triggerHovered = useRef(false)
  const tooltipHovered = useRef(false)
  const triggerFocused = useRef(false)
  const dismissed = useRef(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  const hasInteraction = () => triggerHovered.current || tooltipHovered.current || triggerFocused.current
  const closeWhenOutside = (delay: number) => {
    cancelClose()
    if (!enabled || hasInteraction()) return
    if (delay === 0) setOpen(false)
    else closeTimer.current = setTimeout(() => {
      closeTimer.current = null
      if (!hasInteraction()) setOpen(false)
    }, delay)
  }
  const openFromTrigger = () => {
    cancelClose()
    if (!enabled || !triggerRef.current) return
    dismissed.current = false
    setTargetRect(triggerRef.current.getBoundingClientRect())
    setOpen(true)
  }
  const dismiss = () => {
    cancelClose()
    dismissed.current = true
    tooltipHovered.current = false
    setOpen(false)
  }

  useEffect(() => {
    if (!enabled) {
      cancelClose()
      triggerHovered.current = false
      tooltipHovered.current = false
      triggerFocused.current = false
    }
    return cancelClose
  }, [enabled])

  return {
    tooltipId,
    isOpen: enabled && open,
    targetRect,
    dismiss,
    triggerProps: {
      onMouseEnter: () => {
        if (!enabled) return
        triggerHovered.current = true
        openFromTrigger()
      },
      onMouseLeave: () => {
        triggerHovered.current = false
        closeWhenOutside(closeDelay)
      },
      onFocus: () => {
        if (!enabled) return
        triggerFocused.current = true
        openFromTrigger()
      },
      onBlur: () => {
        triggerFocused.current = false
        closeWhenOutside(0)
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (!event.defaultPrevented && event.key === 'Escape') dismiss()
      },
    },
    tooltipProps: {
      onMouseEnter: () => {
        tooltipHovered.current = true
        cancelClose()
        if (enabled && !dismissed.current) setOpen(true)
      },
      onMouseLeave: () => {
        tooltipHovered.current = false
        closeWhenOutside(closeDelay)
      },
    },
  }
}
