import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AutonomyWidgetState } from './AutonomyWidget.types'
import { getActionConfig } from './AutonomyWidget.configs'
import { AutonomyWidgetContext } from './AutonomyWidget.context'

export const AutonomyWidgetProvider = ({
  children,
  initialState,
}: {
  children: ReactNode
  initialState: AutonomyWidgetState
}) => {
  const [state, setState] = useState<AutonomyWidgetState>(initialState)

  // Update derived fields when action changes
  useEffect(() => {
    const config = getActionConfig(state.action)
    setState((prev) => ({
      ...prev,
      actionName: config.displayName,
      timerIcon: config.timerIcon,
      buttons: config.buttons,
    }))
  }, [state.action])

  return (
    <AutonomyWidgetContext.Provider value={{ state, setState }}>
      {children}
    </AutonomyWidgetContext.Provider>
  )
}
