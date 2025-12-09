import { useState, useEffect } from 'react'
import throttle from 'lodash/throttle'

/**
 * Custom React hook that returns a boolean indicating if the window width is below a given breakpoint.
 *
 * @param breakpoint - The pixel width to compare against the current window width.
 * @returns {boolean} True if window.innerWidth < breakpoint, otherwise false.
 *
 * @example
 * const isMobile = useBreakpoint(768)
 * if (isMobile) { ... }
 */
export const useBreakpoint = (breakpoint: number) => {
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(
    window.innerWidth < breakpoint
  )

  useEffect(() => {
    const handleResize = throttle(() => {
      setIsBelowBreakpoint(window.innerWidth < breakpoint)
    }, 100)

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isBelowBreakpoint
}
