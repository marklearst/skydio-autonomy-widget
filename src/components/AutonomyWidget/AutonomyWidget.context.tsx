import { createContext } from 'react'
import type { AutonomyWidgetContextType } from './AutonomyWidget.types'

export const AutonomyWidgetContext = createContext<
  AutonomyWidgetContextType | undefined
>(undefined)
