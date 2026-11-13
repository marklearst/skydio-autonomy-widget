import {
  AutonomyWidget,
  AutonomyWidgetProvider,
  type AutonomyWidgetStateInput,
  type AutonomyWidgetState,
  type AutonomyWidgetActionEvent,
} from '../components'

interface ControlledIntegrationExampleProps {
  state: AutonomyWidgetStateInput
  onStateChange: (next: AutonomyWidgetState) => void
  onAction?: (event: AutonomyWidgetActionEvent) => void
  onOrbitProgressChange?: (progress: number) => void
}

/** The application supplies state and handles UI intent through callbacks. */
export function ControlledIntegrationExample({
  state,
  onStateChange,
  onAction,
  onOrbitProgressChange,
}: ControlledIntegrationExampleProps) {
  return (
    <AutonomyWidgetProvider
      state={state}
      onStateChange={onStateChange}
      onAction={onAction}
      onOrbitProgressChange={onOrbitProgressChange}>
      <AutonomyWidget />
    </AutonomyWidgetProvider>
  )
}
