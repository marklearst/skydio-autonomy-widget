import { act, StrictMode, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { AutonomyWidget } from './AutonomyWidget'
import { AutonomyWidgetProvider } from './AutonomyWidget.provider'
import { createAutonomyWidgetState } from './AutonomyWidget.state'
import { useAutonomyWidget } from './hooks/useAutonomyWidget'
import type { ActionType, AutonomyWidgetStateInput } from './AutonomyWidget.types'
import '../../styles/theme.css'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let container: HTMLDivElement
let root: Root
beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(async () => { await act(async () => root.unmount()); container.remove(); vi.useRealTimers(); vi.restoreAllMocks() })
const click = async (name: string) => {
  const button = container.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)
  expect(button).not.toBeNull()
  await act(async () => button!.click())
}

it('resolves a complete initial presentation and validates external values', () => {
  const state = createAutonomyWidgetState({action:'waypoint-mission',time:90})
  expect(state.actionName).toBe('Flying to Point 1')
  expect(state.buttons.map(button => button.ariaLabel)).toContain('Refresh waypoint')
  expect(state.timerIcon).toBe('RouteIcon')
  expect(state.orbitProgress).toBe(50)
  expect(createAutonomyWidgetState({action:'unknown' as ActionType,time:Infinity,orbitProgress:-10})).toMatchObject({action:'idle',time:0,orbitProgress:0})
  expect(createAutonomyWidgetState({action:'orbiting',time:5000,orbitProgress:200})).toMatchObject({time:3599,orbitProgress:100})
})

it('supports the minimal uncontrolled instance without duplicated derived props', async () => {
  await act(async () => root.render(<AutonomyWidgetProvider><AutonomyWidget /></AutonomyWidgetProvider>))
  expect(container.textContent).toContain('Flying to Point 1')
  await click('Pause')
  expect(container.textContent).toContain('Mission Paused')
  await click('Resume')
  expect(container.textContent).toContain('Flying to Point 1')
})

it('a controlled owner receives intent and decides when state changes', async () => {
  const onChange = vi.fn()
  const input = {action:'waypoint-mission' as const,time:90}
  await act(async () => root.render(<AutonomyWidgetProvider state={input} onStateChange={onChange}><AutonomyWidget /></AutonomyWidgetProvider>))
  await click('Pause')
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({isPaused:true}))
  expect(container.querySelector('[aria-label="Pause"]')).not.toBeNull()
  await click('Pause')
  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({isPaused:true}))
  await act(async () => root.render(<AutonomyWidgetProvider state={onChange.mock.calls[0][0]} onStateChange={onChange}><AutonomyWidget /></AutonomyWidgetProvider>))
  expect(container.querySelector('[aria-label="Resume"]')).not.toBeNull()
})

it('controlled integration and command callbacks work under StrictMode', async () => {
  const onAction = vi.fn()
  function Controlled() {
    const [state, setState] = useState<AutonomyWidgetStateInput>({action:'waypoint-mission',time:90,expanded:true})
    return <AutonomyWidgetProvider state={state} onStateChange={setState} onAction={onAction}><AutonomyWidget /></AutonomyWidgetProvider>
  }
  await act(async () => root.render(<StrictMode><Controlled /></StrictMode>))
  await click('Refresh waypoint')
  expect(onAction).toHaveBeenCalledExactlyOnceWith({type:'mission-action',action:'waypoint-mission',id:'refresh'})
  await click('Pause')
  expect(container.textContent).toContain('Exit Mission')
  await click('Resume')
  expect(container.querySelector('[aria-label="Refresh waypoint"]')).not.toBeNull()
})

it('batched updater functions use the latest local state', async () => {
  const onChange = vi.fn()
  function Increment() {
    const {state,setState} = useAutonomyWidget()
    return <button onClick={() => {
      setState(previous => ({...previous,orbitProgress:(previous.orbitProgress ??0)+5}))
      setState(previous => ({...previous,orbitProgress:(previous.orbitProgress ??0)+5}))
    }}>{state.orbitProgress}</button>
  }
  await act(async () => root.render(<AutonomyWidgetProvider initialState={{action:'orbiting',time:90}} onStateChange={onChange}><Increment /></AutonomyWidgetProvider>))
  await act(async () => container.querySelector('button')!.click())
  expect(container.textContent).toBe('60')
  expect(onChange).toHaveBeenCalledTimes(2)
})

it('batched controlled updates compose before the owner renders', async () => {
  function Increment() {
    const {state, setState} = useAutonomyWidget()
    return <button onClick={() => {
      setState(previous => ({...previous, orbitProgress: (previous.orbitProgress ?? 0) + 5}))
      setState(previous => ({...previous, orbitProgress: (previous.orbitProgress ?? 0) + 5}))
    }}>{state.orbitProgress}</button>
  }
  function Controlled() {
    const [state, setState] = useState<AutonomyWidgetStateInput>({action:'orbiting',time:90})
    return <AutonomyWidgetProvider state={state} onStateChange={setState}><Increment /></AutonomyWidgetProvider>
  }
  await act(async () => root.render(<StrictMode><Controlled /></StrictMode>))
  await act(async () => container.querySelector('button')!.click())
  expect(container.textContent).toBe('60')
})

it('compact mode removes hidden actions from keyboard navigation and restores expansion', async () => {
  await act(async () => root.render(<AutonomyWidgetProvider initialState={{action:'waypoint-mission',time:90,expanded:true}}><AutonomyWidget /></AutonomyWidgetProvider>))
  expect(container.querySelector('[aria-label="Mission actions"]')).not.toBeNull()
  Object.defineProperty(window,'innerWidth',{configurable:true,value:390})
  await act(async () => { window.dispatchEvent(new Event('resize')) })
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 260)) })
  expect(container.querySelector('[aria-label="Mission actions"]')).toBeNull()
  expect(container.querySelectorAll('button')).toHaveLength(1)
  expect(container.querySelector('[aria-label="Pause"]')).not.toBeNull()
  Object.defineProperty(window,'innerWidth',{configurable:true,value:1024})
  await act(async () => { window.dispatchEvent(new Event('resize')) })
  expect(container.querySelector('[aria-label="Refresh waypoint"]')).not.toBeNull()
})
