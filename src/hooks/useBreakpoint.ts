import { useCallback, useSyncExternalStore } from 'react'
import throttle from 'lodash/throttle'

const serverSnapshot = () => false
const subscribe = (onChange: () => void) => {
  const handleResize = throttle(onChange, 100)
  window.addEventListener('resize', handleResize)
  return () => {
    window.removeEventListener('resize', handleResize)
    handleResize.cancel()
  }
}

/** Returns whether the browser viewport is below the supplied pixel width. */
export const useBreakpoint = (breakpoint: number) => {
  const readViewport = useCallback(() => window.innerWidth < breakpoint, [breakpoint])
  return useSyncExternalStore(subscribe, readViewport, serverSnapshot)
}
