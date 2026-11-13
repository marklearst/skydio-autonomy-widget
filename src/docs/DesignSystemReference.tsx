import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { AutonomyWidget, AutonomyWidgetProvider, Button, StatusMessage, type AutonomyWidgetStateInput } from '../components'
import { useCssTokens } from './useCssTokens'

const roles = [
  { name: 'Surface', primitive: '--color-gray-900', semantic: '--color-surface', consumer: '.autonomy-widget-surface', description: 'One neutral surface for the widget and its canvas.' },
  { name: 'Secondary action', primitive: '--color-gray-800', semantic: '--color-surface-raised', consumer: 'Button · variant="action"', description: 'A raised neutral distinguishes mission actions from the surrounding surface.' },
  { name: 'Pause', primitive: '--color-primary-red', semantic: '--color-action-pause', consumer: 'Button · variant="stop-borderless"', description: 'The pause role stays consistent across missions; the callback determines the command.' },
  { name: 'Resume', primitive: '--color-primary-blue', semantic: '--color-action-resume', consumer: 'Button · variant="play-borderless"', description: 'Resume has its own action role rather than a local blue override.' },
] as const

/** Trace a real CSS alias to its real component consumer. */
export function TokenTrace() {
  const [selected, setSelected] = useState(0)
  const role = roles[selected]
  const values = useCssTokens([role.semantic])

  return (
    <section className="docs-token-trace" aria-label="Trace a design token">
      <div className="docs-choice-group" role="group" aria-label="Token role">
        {roles.map((item, index) => <button key={item.name} type="button" aria-pressed={index === selected} onClick={() => setSelected(index)}>{item.name}</button>)}
      </div>
      <ol className="docs-token-chain">
        <li><span className="docs-step">01 / Primitive</span><span className="docs-token-large-swatch" style={{ background: `var(${role.primitive})` }} aria-hidden="true" /><code>{role.primitive}</code><span>Palette definition</span></li>
        <li><span className="docs-step">02 / Semantic role</span><strong>{role.name}</strong><code>{role.semantic}</code><span>{values[role.semantic] || 'Reading stylesheet…'}</span></li>
        <li><span className="docs-step">03 / Component</span><strong>One shared decision</strong><code>{role.consumer}</code><span>{role.description}</span></li>
      </ol>
      <p className="docs-reference-note">These swatches and resolved values use the active stylesheet. Components consume the role; changing a palette definition propagates through that relationship.</p>
    </section>
  )
}

/** Shared controls, not drawn replicas, demonstrate the actual appearance contract. */
export function ComponentStates() {
  const [paused, setPaused] = useState(false)
  const [lastAction, setLastAction] = useState('Try Refresh or Next to inspect a local callback.')
  return (
    <div className="docs-component-specimens">
      <div className="docs-specimen-row"><div><strong>Neutral actions</strong><span>Shared shape, spacing, type, and border.</span></div><div className="docs-specimen-controls"><Button variant="action" icon="ArrowTurnDownLeftIcon" label="Refresh" size="auto" onClick={() => setLastAction('Refresh callback received.')} /><Button variant="action" icon="ChevronRightIcon" ariaLabel="Next waypoint" tooltip="Next waypoint" onClick={() => setLastAction('Next waypoint callback received.')} /><Button variant="action" label="Unavailable" size="auto" disabled /></div><output className="docs-specimen-feedback">{lastAction}</output></div>
      <div className="docs-specimen-row"><div><strong>Stateful primary control</strong><span>Activate to see the pause/resume handoff.</span></div><Button variant={paused ? 'play-borderless' : 'stop-borderless'} icon={paused ? 'PlayIcon' : 'StopSignIcon'} label={paused ? 'Resume' : 'Pause'} size="auto" onClick={() => setPaused(previous => !previous)} /></div>
      <div className="docs-specimen-row"><div><strong>Mission status</strong><span>Compact text with a polite announcement.</span></div><StatusMessage message={paused ? 'Mission Paused' : 'Flying to Point 1'} /></div>
    </div>
  )
}

const monitoring: AutonomyWidgetStateInput = { action: 'waypoint-mission', time: 407, expanded: false, isPaused: false, orbitProgress: 80 }
const sequence = [
  { label: 'Monitoring', state: monitoring },
  { label: 'Reveal mission controls', state: { ...monitoring, expanded: true } },
  { label: 'Pause without losing context', state: { ...monitoring, expanded: true, isPaused: true } },
  { label: 'Resume the mission', state: { ...monitoring, expanded: true } },
  { label: 'Switch to orbit', state: { ...monitoring, action: 'orbiting' as const, expanded: true } },
  { label: 'Adjust orbit progress', state: { ...monitoring, action: 'orbiting' as const, expanded: true, orbitProgress: 95 } },
  { label: 'Return to the center reference', state: { ...monitoring, action: 'orbiting' as const, expanded: true, orbitProgress: 50 } },
]

/** A finite, explicitly requested motion study using the actual widget. */
export function MotionStudy() {
  const [state, setState] = useState(monitoring)
  const [phase, setPhase] = useState('Monitoring')
  const [replaying, setReplaying] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const reducedMotion = useReducedMotion()
  const clearSequence = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearSequence, [])

  const takeOver = () => {
    clearSequence()
    setReplaying(false)
    setPhase('Your interaction')
  }

  const replay = () => {
    clearSequence()
    setReplaying(true)
    sequence.forEach((step, index) => {
      const apply = () => {
        setState(step.state)
        setPhase(step.label)
        if (index === sequence.length - 1) setReplaying(false)
      }
      if (index === 0) apply()
      else timers.current.push(setTimeout(apply, index * 800))
    })
  }

  return (
    <section className="docs-motion-study" aria-label="Widget motion study">
      <div className="docs-motion-heading"><div><strong>Continuity, at component scale</strong><p>{reducedMotion ? 'Reduced motion is active. States change without animated travel.' : 'A finite sequence. No motion runs until you request it.'}</p></div><button type="button" className="docs-action-button" onClick={replay}>{replaying ? 'Replay again' : 'Replay transitions'}</button></div>
      <div className="docs-motion-stage">
        <AutonomyWidgetProvider state={state} onStateChange={next => { takeOver(); setState(next) }} onAction={takeOver}>
          <AutonomyWidget />
        </AutonomyWidgetProvider>
      </div>
      <div className="docs-motion-caption"><span>{phase}</span><span>Interact at any point to take over.</span></div>
    </section>
  )
}

export function GeometryReference() {
  return (
    <div className="docs-geometry" aria-label="Control geometry and typography">
      <div className="docs-geometry-targets"><div><span className="docs-target docs-target-fine"><span /></span><strong>32px</strong><span>Fine pointer</span></div><div><span className="docs-target docs-target-coarse"><span /></span><strong>44px</strong><span>Coarse pointer</span></div><p>The target grows. The icon stays 16px.</p></div>
      <dl className="docs-type-scale"><div><dt><code>--text-status</code></dt><dd style={{fontSize:'var(--text-status)'}}>Mission status <span>13px</span></dd></div><div><dt><code>--text-control</code></dt><dd style={{fontSize:'var(--text-control)'}}>Action label <span>14px</span></dd></div><div><dt><code>--text-tooltip</code></dt><dd style={{fontSize:'var(--text-tooltip)'}}>Supporting help <span>12px</span></dd></div></dl>
    </div>
  )
}
