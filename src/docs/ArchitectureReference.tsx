import { useId, useState } from 'react'
import { ACTION_CONFIGS } from '../components/AutonomyWidget/AutonomyWidget.configs'
import type { ActionType } from '../components/AutonomyWidget'

const retainedFixtures = new Set<ActionType>(['mission-paused', 'fly-to-point-paused', 'orbit-paused'])
const missions = Object.keys(ACTION_CONFIGS) as ActionType[]

function FlowArrow() {
  return <svg className="docs-flow-arrow" width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden="true"><path d="M2 12h27m-7-6 7 6-7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

/** The real data flow, with the application's command lifecycle outside the component. */
export function ArchitectureDiagram() {
  return (
    <figure className="docs-architecture" aria-label="Widget architecture and application boundary">
      <ol className="docs-architecture-flow">
        <li className="docs-flow-node">
          <span className="docs-step">01 / Application</span>
          <strong>Own the mission</strong>
          <code>state</code>
          <p>Mission, duration, pause, expansion, orbit.</p>
        </li>
        <li className="docs-flow-connector" role="presentation" aria-hidden="true"><FlowArrow /></li>
        <li className="docs-flow-node docs-flow-node-core">
          <div className="docs-architecture-catalog">
            <strong>Mission catalog</strong>
            <code>AutonomyWidget.configs.ts</code>
            <span>Names · icons · available actions</span>
            <span className="docs-architecture-down" aria-hidden="true">↓</span>
          </div>
          <span className="docs-step">02 / Provider</span>
          <strong>Resolve presentation</strong>
          <code>createAutonomyWidgetState</code>
          <p>Normalize inputs. Select the catalog entry. Share state through context.</p>
        </li>
        <li className="docs-flow-connector" role="presentation" aria-hidden="true"><FlowArrow /></li>
        <li className="docs-flow-node">
          <span className="docs-step">03 / Widget</span>
          <strong>Render the controls</strong>
          <code>AutonomyWidget</code>
          <p>Status, timer, primary action, and mission controls.</p>
        </li>
      </ol>
      <div className="docs-architecture-return">
        <span aria-hidden="true">↶</span>
        <div><strong>UI intent returns to the application</strong><code>onStateChange · onAction · onOrbitProgressChange</code></div>
      </div>
      <figcaption>The application passes state in and handles callbacks out. Configuration supplies presentation rules. Transport, acknowledgment, and authoritative telemetry belong to the application.</figcaption>
    </figure>
  )
}

/** Inspect actual build-time configuration; this is a reader, not a runtime config editor. */
export function MissionConfigExplorer() {
  const [action, setAction] = useState<ActionType>('waypoint-mission')
  const inputId = useId()
  const config = ACTION_CONFIGS[action]
  return (
    <section className="docs-config-explorer" aria-label="Live mission configuration reference">
      <div className="docs-config-heading">
        <div><label htmlFor={inputId}>Inspect a mission</label><p>Read directly from the configuration file.</p></div>
        <select id={inputId} value={action} onChange={event => setAction(event.target.value as ActionType)}>
          <optgroup label="Active missions">{missions.filter(mission => !retainedFixtures.has(mission)).map(mission => <option key={mission} value={mission}>{mission}</option>)}</optgroup>
          <optgroup label="Retained paused fixtures">{missions.filter(mission => retainedFixtures.has(mission)).map(mission => <option key={mission} value={mission}>{mission}</option>)}</optgroup>
        </select>
      </div>
      <div className="docs-config-summary">
        <div><span>Status</span><strong>{config.displayName}</strong></div>
        <div><span>Active controls</span><strong>{config.buttons.length}</strong></div>
        <div><span>Paused controls</span><strong>{config.pausedButtons?.length ?? 0}</strong></div>
      </div>
      <div className="docs-code-heading"><code>ACTION_CONFIGS[&quot;{action}&quot;]</code><span>Actual catalog data</span></div>
      <pre className="docs-config-source" tabIndex={0} aria-label="Selected mission configuration"><code>{JSON.stringify(config, null, 2)}</code></pre>
    </section>
  )
}
