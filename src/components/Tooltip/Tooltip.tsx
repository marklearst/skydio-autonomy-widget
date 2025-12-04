import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  targetRect: DOMRect | null
  children: React.ReactNode
  visible: boolean
}

const Tooltip: React.FC<TooltipProps> = ({ targetRect, children, visible }) => {
  const [style, setStyle] = useState<React.CSSProperties | null>(null)

  useEffect(() => {
    if (targetRect && visible) {
      setStyle({
        position: 'fixed',
        top: targetRect.bottom + 14, // 14px below the button
        left: targetRect.left + targetRect.width / 2,
        transform: 'translate(-50%, 0)',
        background: '#000',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 1,
        transition: 'opacity 0.15s ease-in-out',
      })
    } else if (!visible) {
      setStyle(null)
    }
  }, [targetRect, visible])

  if (!visible || !style) return null

  return createPortal(<div style={style}>{children}</div>, document.body)
}

export default Tooltip
