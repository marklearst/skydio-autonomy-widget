import {
  AutonomyWidget,
  AutonomyWidgetProvider,
} from '../components/AutonomyWidget'

/** The minimal uncontrolled integration; mission presentation is derived synchronously. */
export function IntegrationExample() {
  return (
    <AutonomyWidgetProvider initialState={{ action: 'waypoint-mission', time: 90 }}>
      <AutonomyWidget />
    </AutonomyWidgetProvider>
  )
}
