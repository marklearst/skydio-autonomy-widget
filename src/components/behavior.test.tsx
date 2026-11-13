import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Timer } from './Timer/Timer'
import { Button } from './Button/Button'
import { Controls } from './Controls/Controls'
import type { ButtonProps } from './Button/Button'
import { OrbitSlider } from './OrbitSlider/OrbitSlider'
import { Tooltip } from './Tooltip/Tooltip'
import { AutonomyWidget } from './AutonomyWidget/AutonomyWidget'
import { AutonomyWidgetProvider } from './AutonomyWidget/AutonomyWidget.provider'
import { AutonomyWidgetContext } from './AutonomyWidget/AutonomyWidget.context'
import { XSquareIcon, RouteIcon } from '../assets/icons'
import { useAutonomyWidget } from './AutonomyWidget/hooks/useAutonomyWidget'
import { getAllActions, getActionConfig } from './AutonomyWidget/AutonomyWidget.configs'
import type { ActionType } from './AutonomyWidget/AutonomyWidget.types'
import { useTimer } from '../hooks/useTimer'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { formatTime } from '../utils/time'
import '../styles/theme.css'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let host: HTMLDivElement
let root: Root
beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.useRealTimers()
  vi.restoreAllMocks()
})
const render = async (node: ReactNode) => { await act(async () => root.render(node)) }
const click = async (label: string) => {
  const button = host.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)
  expect(button).not.toBeNull()
  await act(async () => button!.click())
}
const advance = async (ms: number) => { await act(async () => vi.advanceTimersByTime(ms)) }

describe('timer behavior', () => {
  it('counts down, pauses, resets, and completes once', async () => {
    vi.useFakeTimers()
    const done = vi.fn()
    let timer: ReturnType<typeof useTimer>
    function Harness({duration = 3, state = 'running', progressOverride}: {duration?: number; state?: 'running' | 'paused'; progressOverride?: number}) {
      timer = useTimer({duration, state, onComplete: done, progressOverride})
      return <output>{timer.remaining}:{timer.progress}</output>
    }
    await render(<Harness />)
    await advance(1000)
    expect(timer!.remaining).toBe(2)
    await render(<Harness state="paused" />)
    await advance(2000)
    expect(timer!.remaining).toBe(2)
    await act(async () => timer!.reset())
    expect(timer!.remaining).toBe(3)
    await render(<Harness duration={1} />)
    await advance(1000)
    expect(timer!.remaining).toBe(0)
    expect(done).toHaveBeenCalledTimes(1)
    await advance(2000)
    expect(done).toHaveBeenCalledTimes(1)
    await render(<Harness duration={-1} progressOverride={2} />)
    expect(timer!.remaining).toBe(0)
    expect(timer!.progress).toBe(1)
    await render(<Harness duration={4000} progressOverride={-1} />)
    expect(timer!.remaining).toBe(3599)
    expect(timer!.progress).toBe(0)
    await render(<Harness duration={4000} progressOverride={NaN} />)
    expect(timer!.progress).toBe(1)
  })

  it('changes from text to icon and restores text when paused or complete', async () => {
    vi.useFakeTimers()
    await render(<Timer duration={20} />)
    expect(host.querySelector('[role="timer"]')).not.toBeNull()
    for (let i = 0; i < 7; i++) await advance(1000)
    expect(host.querySelector('[aria-hidden="true"] svg')).not.toBeNull()
    await render(<Timer duration={20} state="paused" />)
    expect(host.querySelector('[role="timer"]')).not.toBeNull()
    await render(<Timer duration={0} />)
    expect(host.querySelector('svg[role="img"]')?.getAttribute('aria-label')).toContain('0:00')
    vi.useRealTimers()
    await render(null)
    await render(<Timer duration={65} condensed />)
    expect(host.querySelector('[role="timer"]')).toBeNull()
    expect(host.querySelector('svg[role="img"]')?.getAttribute('aria-label')).toContain('1:05')
  })

  it('shows and hides a timer tooltip', async () => {
    vi.useFakeTimers()
    await render(<Timer duration={10} tooltip="ETA" />)
    const wrapper = host.firstElementChild!
    await act(async () => wrapper.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })))
    expect(document.querySelector('[role="tooltip"]')?.textContent).toBe('ETA')
    await act(async () => wrapper.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })))
    await advance(250)
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })
})

it('button supports focus and hover tooltips, clicks, and disabled state', async () => {
  vi.useFakeTimers()
  const onClick = vi.fn()
  await render(<Button ariaLabel="Action" label="Action" tooltip="Help" onClick={onClick} />)
  const button = host.querySelector('button')!
  await act(async () => button.focus())
  expect(document.querySelector('[role="tooltip"]')?.textContent).toBe('Help')
  await click('Action')
  expect(onClick).toHaveBeenCalledTimes(1)
  await act(async () => button.blur())
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
  await act(async () => button.dispatchEvent(new MouseEvent('mouseover', {bubbles:true})))
  expect(document.querySelector('[role="tooltip"]')).not.toBeNull()
  await act(async () => button.dispatchEvent(new MouseEvent('mouseout', {bubbles:true})))
  await advance(250)
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
  await render(<Button ariaLabel="Action" disabled onClick={onClick} />)
  await click('Action')
  expect(onClick).toHaveBeenCalledTimes(1)
})

it('tooltip uses target geometry and disappears without a target', async () => {
  await render(<Tooltip visible targetRect={new DOMRect(20, 30, 40, 10)}>Details</Tooltip>)
  const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')!
  expect(tooltip.style.top).toBe('54px')
  expect(tooltip.style.left).toBe('40px')
  await render(<Tooltip visible targetRect={null}>Details</Tooltip>)
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
})

it('renders a warning instead of a broken button for an invalid icon', async () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  await render(<Button ariaLabel="Unavailable action" icon={'MissingIcon' as never} />)
  expect(host.querySelector('button')).toBeNull()
  expect(host.querySelector('[aria-label="Unavailable action"]')?.textContent).toContain('⚠')
  expect(error).toHaveBeenCalledWith('Icon "MissingIcon" not found in icons barrel.')
})

it('compact widget keeps mission controls and exposes timer help', async () => {
  Object.defineProperty(window, 'innerWidth', { configurable:true, value:400 })
  await render(<AutonomyWidgetProvider initialState={{action:'waypoint-mission', actionName:'', buttons:[], time:60, expanded:false, isPaused:false}}><AutonomyWidget /></AutonomyWidgetProvider>)
  expect(host.querySelector('[role="status"]')?.classList.contains('sr-only')).toBe(true)
  expect(host.querySelector('[aria-label="Expand"]')).toBeNull()
  await click('Pause')
  expect(host.querySelector('[aria-label="Resume"]')).not.toBeNull()
  await click('Resume')
})

it('orbit controls clamp at limits, sync new progress, and respect disabled', async () => {
  const change = vi.fn()
  await render(<OrbitSlider min={0} max={10} step={7} progress={5} onChange={change} />)
  await click('Increase orbit progress')
  expect(change).toHaveBeenLastCalledWith(10)
  expect(host.querySelector<HTMLButtonElement>('[aria-label="Increase orbit progress"]')!.disabled).toBe(true)
  await click('Decrease orbit progress')
  expect(change).toHaveBeenLastCalledWith(3)
  await click('Decrease orbit progress')
  expect(change).toHaveBeenLastCalledWith(0)
  expect(host.querySelector<HTMLButtonElement>('[aria-label="Decrease orbit progress"]')!.disabled).toBe(true)
  await render(<OrbitSlider progress={80} disabled />)
  expect([...host.querySelectorAll('button')].every(b => b.disabled)).toBe(true)
  await render(<OrbitSlider progress={30} />)
  await click('Increase orbit progress')
  await click('Decrease orbit progress')
})

it('breakpoint reacts to resizing and removes its listener', async () => {
  const width = window.innerWidth
  function Harness() { return <output>{String(useBreakpoint(600))}</output> }
  try {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 900 })
    await render(<Harness />)
    expect(host.textContent).toBe('false')
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 400 })
    await act(async () => window.dispatchEvent(new Event('resize')))
    expect(host.textContent).toBe('true')
    const remove = vi.spyOn(window, 'removeEventListener')
    await render(null)
    expect(remove).toHaveBeenCalledWith('resize', expect.any(Function))
  } finally { Object.defineProperty(window, 'innerWidth', { configurable:true, value:width }) }
})

it.each([[0,'0:00'],[-1,'0:00'],[65.9,'1:05'],[3661,'1:01:01']])('formats %s seconds as %s', (seconds, expected) => {
  expect(formatTime(Number(seconds))).toBe(expected)
})

it('requires a provider for widget context', async () => {
  function MissingProvider() { useAutonomyWidget(); return null }
  await expect(render(<MissingProvider />)).rejects.toThrow('must be used within an AutonomyWidgetProvider')
})

it.each(getAllActions())('supports pause, resume, and expansion for %s', async action => {
  await render(<AutonomyWidgetProvider initialState={{ action, actionName:'', buttons:[], time:20, expanded:false, isPaused:false }}><AutonomyWidget /></AutonomyWidgetProvider>)
  expect(host.textContent).toContain(getActionConfig(action).displayName)
  await click('Pause')
  expect(host.textContent).toContain(getActionConfig(action).pausedName || 'Mission Paused')
  await click('Resume')
  if(host.querySelector('[aria-label="Expand"]')) {
    await click('Expand')
    await vi.waitFor(() => {
      expect(getComputedStyle(host.querySelector('.autonomy-widget-base')!).height).toBe('88px')
    })
    await click('Collapse')
    await vi.waitFor(() => {
      expect(getComputedStyle(host.querySelector('.autonomy-widget-base')!).height).toBe('48px')
    })
  }
})

it('falls back to idle for unrecognized action data', () => {
  expect(getActionConfig('unknown' as ActionType)).toBe(getActionConfig('idle'))
})

it('falls back to a safe timer icon for unknown or missing icon names', async () => {
  vi.useFakeTimers()
  const state = {
    action: 'waypoint-single-point' as const,
    actionName: 'Flying to Point',
    buttons: [],
    time: 20,
    expanded: false,
    isPaused: false,
  }
  await render(<XSquareIcon />)
  const fallbackPath = host.querySelector('path')!.getAttribute('d')
  await render(<RouteIcon />)
  const defaultPath = host.querySelector('path')!.getAttribute('d')
  for (const timerIcon of ['UnknownIcon', undefined]) {
    await render(null)
    await render(<AutonomyWidgetContext.Provider value={{state: {...state, timerIcon}, setState: vi.fn()}}><AutonomyWidget /></AutonomyWidgetContext.Provider>)
    for (let i = 0; i < 7; i++) await advance(1000)
    const icon = host.querySelector('[aria-hidden="true"] svg path')
    expect(icon?.getAttribute('d')).toBe(timerIcon ? fallbackPath : defaultPath)
    expect(host.querySelector('[aria-label="Pause"]')).not.toBeNull()
  }
})

it('keeps a paused condensed timer icon visible with accessible remaining time', async () => {
  await render(<Timer duration={120} state="paused" condensed />)
  expect(host.querySelector('[role="timer"]')).toBeNull()
  expect(host.querySelector('[aria-hidden="true"] svg')).not.toBeNull()
  expect(host.querySelector('svg[role="img"]')?.getAttribute('aria-label')).toBe('Timer: 2:00 remaining')
})

it('defaults an unspecified timer to zero and completes without a callback', async () => {
  vi.useFakeTimers()
  let timer: ReturnType<typeof useTimer>
  function Harness({duration}: {duration?: number}) {
    timer = useTimer({duration})
    return <output>{timer.remaining}</output>
  }
  await render(<Harness />)
  expect(timer!.remaining).toBe(0)
  expect(timer!.progress).toBe(1)
  await render(<Harness duration={1} />)
  await advance(1000)
  expect(timer!.remaining).toBe(0)
  await advance(1000)
  expect(timer!.remaining).toBe(0)
})

it('shows short countdowns and clamps the progress ring at both ends', async () => {
  await render(<Timer duration={9} progress={-1} state="paused" />)
  expect(host.querySelector('[role="timer"]')?.textContent).toBe('0:09')
  const ring = () => host.querySelectorAll('circle')[1]
  expect(Number(ring().getAttribute('stroke-dashoffset'))).toBeCloseTo(Number(ring().getAttribute('stroke-dasharray')))
  await render(<Timer duration={9} progress={2} state="paused" />)
  expect(Number(ring().getAttribute('stroke-dashoffset'))).toBe(0)
})

it.each(getAllActions())('configured controls dispatch their callbacks for %s', async action => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  const errors = vi.spyOn(console, 'error')
  const config = getActionConfig(action)
  const buttons = [...config.buttons, ...(config.pausedButtons || [])]
    .filter(button => !button.component)
  for (const button of buttons) {
    expect((button.ariaLabel || button.label).trim()).not.toBe('')
    const handler = vi.fn(button.onClick)
    await render(<Controls buttons={[{
      icon: button.icon as ButtonProps['icon'],
      ariaLabel: button.ariaLabel || button.label,
      label: button.label,
      variant: 'action',
      onClick: handler,
    }]} />)
    const control = host.querySelector('button')!
    expect(control).not.toBeNull()
    expect(control.textContent).toContain(button.label)
    await act(async () => control.click())
    expect(handler).toHaveBeenCalledTimes(1)
  }
  expect(errors).not.toHaveBeenCalled()
})

it('expanded widget emits action intent and shared orbit changes', async () => {
  const onAction = vi.fn()
  const onOrbitProgressChange = vi.fn()
  await render(<AutonomyWidgetProvider onAction={onAction} initialState={{action:'waypoint-mission', actionName:'', buttons:[], time:60, expanded:true, isPaused:false}}><AutonomyWidget /></AutonomyWidgetProvider>)
  const button = getActionConfig('waypoint-mission').buttons[0]
  await click(button.ariaLabel || button.label)
  expect(onAction).toHaveBeenCalledWith({type:'mission-action', action:'waypoint-mission', id:button.id})
  await render(null)
  await render(<AutonomyWidgetProvider onOrbitProgressChange={onOrbitProgressChange} initialState={{action:'orbiting', actionName:'', buttons:[], time:60, expanded:true, isPaused:false}}><AutonomyWidget /></AutonomyWidgetProvider>)
  await click('Increase orbit progress')
  expect(onOrbitProgressChange).toHaveBeenCalledWith(55)
  expect(host.querySelector('[role="meter"]')?.getAttribute('aria-valuenow')).toBe('55')
})
