import { useId, useRef, useState } from 'react'
import {
  createAutonomyWidgetState,
  type AutonomyWidgetActionEvent,
  type AutonomyWidgetState,
  type AutonomyWidgetStateInput,
} from '../components/AutonomyWidget'
import { getActionConfig } from '../components/AutonomyWidget/AutonomyWidget.configs'
import { ControlledIntegrationExample } from './ControlledIntegrationExample'

const missions = [
  { action: 'waypoint-mission', label: 'Waypoint mission', time: 407 },
  { action: 'orbiting', label: 'Orbit', time: 120 },
  { action: 'returning-to-dock', label: 'Return to dock', time: 240 },
] as const

const initialState: AutonomyWidgetStateInput = {
  action: 'waypoint-mission', time: 407, expanded: true, isPaused: false, orbitProgress: 80,
}

function missionInputs(state: AutonomyWidgetStateInput) {
  return {
    action: state.action,
    time: state.time,
    expanded: state.expanded ?? false,
    isPaused: state.isPaused ?? false,
    orbitProgress: state.orbitProgress ?? 50,
  }
}

type CallbackEntry = {
  sequence: number
  name: 'onStateChange' | 'onAction' | 'onOrbitProgressChange'
  value: ReturnType<typeof missionInputs> | AutonomyWidgetActionEvent | number
}

/** A real controlled integration: host input flows in, widget callbacks flow out. */
export function ExternalControlExample() {
  const id = useId()
  const [state, setState] = useState(initialState)
  const [events, setEvents] = useState<CallbackEntry[]>([])
  const sequence = useRef(0)
  const resolved = createAutonomyWidgetState(state)
  const config = getActionConfig(resolved.action)
  const visibleActions = resolved.isPaused ? config.pausedButtons ?? [] : resolved.buttons
  const presentation = {
    status: resolved.isPaused ? config.pausedName || 'Mission Paused' : resolved.actionName,
    timerIcon: resolved.timerIcon,
    actions: visibleActions.map(button => button.id),
  }

  const record = (name: CallbackEntry['name'], value: CallbackEntry['value']) => {
    const entry = { sequence: ++sequence.current, name, value }
    setEvents(previous => [...previous, entry].slice(-4))
  }
  const receiveState = (next: AutonomyWidgetState) => {
    const inputs = missionInputs(next)
    setState(inputs)
    record('onStateChange', inputs)
  }

  return (
    <section className="docs-lab" aria-label="External control example">
      <div className="docs-lab-host">
        <div className="docs-lab-label">Host application</div>
        <p className="docs-lab-description">Change the state supplied to the widget.</p>
        <fieldset className="docs-lab-fields">
          <legend className="sr-only">Host state</legend>
          <label className="docs-lab-field" htmlFor={`${id}-mission`}>
            <span>Mission</span>
            <select
              id={`${id}-mission`}
              value={state.action}
              onChange={event => {
                const mission = missions.find(item => item.action === event.currentTarget.value)
                if (mission) setState(previous => ({
                  ...previous, action: mission.action, time: mission.time, isPaused: false,
                }))
              }}>
              {missions.map(mission => <option key={mission.action} value={mission.action}>{mission.label}</option>)}
            </select>
          </label>
          <label className="docs-lab-check" htmlFor={`${id}-paused`}>
            <input id={`${id}-paused`} type="checkbox" checked={!!state.isPaused}
              onChange={event => {
                const isPaused = event.currentTarget.checked
                setState(previous => ({ ...previous, isPaused }))
              }} />
            <span>Paused</span>
          </label>
          <label className="docs-lab-check" htmlFor={`${id}-expanded`}>
            <input id={`${id}-expanded`} type="checkbox" checked={!!state.expanded}
              onChange={event => {
                const expanded = event.currentTarget.checked
                setState(previous => ({ ...previous, expanded }))
              }} />
            <span>Expanded controls</span>
          </label>
          {state.action === 'orbiting' && (
            <label className="docs-lab-field docs-lab-orbit" htmlFor={`${id}-orbit`}>
              <span>Orbit progress (%) <output htmlFor={`${id}-orbit`}>{resolved.orbitProgress}%</output></span>
              <input id={`${id}-orbit`} type="range" min={0} max={100} step={5}
                value={resolved.orbitProgress}
                onChange={event => {
                  const orbitProgress = Number(event.currentTarget.value)
                  setState(previous => ({ ...previous, orbitProgress }))
                }} />
            </label>
          )}
        </fieldset>
      </div>

      <div className="docs-lab-stage">
        <div className="docs-lab-label">Rendered widget</div>
        <ControlledIntegrationExample
          state={state}
          onStateChange={receiveState}
          onAction={event => record('onAction', event)}
          onOrbitProgressChange={value => record('onOrbitProgressChange', value)} />
        <p className="docs-lab-description">Use the widget to send values back to its host.</p>
      </div>

      <div className="docs-lab-inspectors">
        <section aria-label="State supplied by the host">
          <h3 className="docs-lab-section-title">State in</h3>
          <pre className="docs-lab-code" tabIndex={0} aria-label="Host state input"><code>{JSON.stringify(missionInputs(state), null, 2)}</code></pre>
        </section>
        <section aria-label="Presentation selected by configuration">
          <h3 className="docs-lab-section-title">Configuration resolved</h3>
          <pre className="docs-lab-code" tabIndex={0} aria-label="Resolved presentation"><code>{JSON.stringify(presentation, null, 2)}</code></pre>
        </section>
      </div>

      <section className="docs-lab-events" aria-label="Widget callback events">
        <h3 className="docs-lab-section-title">Events out</h3>
        <p className="docs-lab-description">Latest four callbacks. State changes show mission inputs. No network request is sent.</p>
        <div role="log" aria-live="polite" aria-relevant="additions" aria-label="Callback history">
          <ol className="docs-lab-event-list">
            {events.length === 0 ? (
              <li className="docs-lab-empty">Pause, expand, or use a mission action to receive a callback.</li>
            ) : events.map(event => (
              <li key={event.sequence}>
                <code className="docs-lab-event-name">{event.name}</code>
                <code className="docs-lab-event-value">{JSON.stringify(event.value)}</code>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </section>
  )
}
