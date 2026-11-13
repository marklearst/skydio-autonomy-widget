import { ACTION_CONFIGS, getActionConfig } from './AutonomyWidget.configs'
import type { AutonomyWidgetState, AutonomyWidgetStateInput } from './AutonomyWidget.types'

/** Resolve caller-owned values and derive all mission presentation in one step. */
export function createAutonomyWidgetState(input: AutonomyWidgetStateInput): AutonomyWidgetState {
  const action = Object.prototype.hasOwnProperty.call(ACTION_CONFIGS, input.action) ? input.action : 'idle'
  const config = getActionConfig(action)
  return {
    action,
    time: Number.isFinite(input.time) ? Math.min(3599, Math.max(0, Math.floor(input.time))) : 0,
    expanded: input.expanded ?? false,
    isPaused: input.isPaused ?? false,
    orbitProgress: Number.isFinite(input.orbitProgress) ? Math.min(100, Math.max(0, input.orbitProgress!)) : 50,
    actionName: config.displayName,
    timerIcon: config.timerIcon,
    buttons: config.buttons,
  }
}
