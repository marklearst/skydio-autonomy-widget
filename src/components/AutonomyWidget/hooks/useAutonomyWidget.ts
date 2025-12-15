import { useContext } from 'react'
import { AutonomyWidgetContext } from '../AutonomyWidget.context'

export function useAutonomyWidget() {
  const context = useContext(AutonomyWidgetContext)
  if (!context) {
    throw new Error(
      'useAutonomyWidget must be used within an AutonomyWidgetProvider'
    )
  }
  return context
}
