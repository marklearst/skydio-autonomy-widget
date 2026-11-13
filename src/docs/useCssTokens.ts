import { useSyncExternalStore } from 'react'

const emptySnapshot = () => '[]'

function subscribeToStyles(onChange: () => void) {
  const pointer = matchMedia('(pointer: coarse)')
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] })
  observer.observe(document.head, { childList: true, subtree: true, characterData: true })
  pointer.addEventListener('change', onChange)
  return () => {
    observer.disconnect()
    pointer.removeEventListener('change', onChange)
  }
}

/** Subscribe to the stylesheet as external state rather than maintaining a second token registry. */
export function useCssTokens(names: readonly string[]): Record<string, string> {
  const snapshot = useSyncExternalStore(subscribeToStyles, () => {
    const styles = getComputedStyle(document.documentElement)
    return JSON.stringify(names.map(name => styles.getPropertyValue(name).trim()))
  }, emptySnapshot)
  const values: string[] = JSON.parse(snapshot)
  return Object.fromEntries(names.map((name, index) => [name, values[index] ?? '']))
}
