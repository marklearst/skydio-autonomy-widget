// for responsive rendering, optional useMediaQuery wrapper

import { useState, useEffect } from 'react'

/**
 * useBreakpoint - returns true if viewport width is less than 1280px
 */
/**
 * useBreakpoint
 * Returns true if the viewport width is less than the given breakpoint (in px).
 * @param breakpoint - The pixel width to compare against (default 1280)
 * @returns boolean - true if window.innerWidth < breakpoint
 */
export function useBreakpoint(breakpoint: number = 1280): boolean {
  const [isBelow, setIsBelow] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )

  useEffect(() => {
    function handleResize() {
      setIsBelow(window.innerWidth < breakpoint)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isBelow
}
