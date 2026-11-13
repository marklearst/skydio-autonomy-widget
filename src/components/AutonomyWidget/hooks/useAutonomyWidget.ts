import { useContext } from 'react'
import { AutonomyWidgetContext } from '../AutonomyWidget.context'

/**
 * Reads `{ state, setState }` from the nearest widget provider.
 *
 * @throws When called outside `AutonomyWidgetProvider`.
 * @remarks `time` is the configured duration, not the timer's remaining value.
 */
export function useAutonomyWidget() {
  const context = useContext(AutonomyWidgetContext)
  if (!context) {
    throw new Error(
      'useAutonomyWidget must be used within an AutonomyWidgetProvider'
    )
  }
  return context
}
