import { useState, useEffect } from 'react'
import throttle from 'lodash/throttle'

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
