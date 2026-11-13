import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Timer } from './Timer'
import { useTimer } from '../../hooks/useTimer'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let host: HTMLDivElement
let root: Root
beforeEach(() => {
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.useRealTimers()
})

it('emits completion once in StrictMode and starts a new run after reset', async () => {
  vi.useFakeTimers()
  const onComplete = vi.fn()
  let timer: ReturnType<typeof useTimer>
  function Harness() {
    timer = useTimer({ duration: 1, onComplete })
    return <output>{timer.remaining}</output>
  }
  await act(async () => root.render(<StrictMode><Harness /></StrictMode>))
  await act(async () => vi.advanceTimersByTime(1000))
  expect(host.textContent).toBe('0')
  expect(onComplete).toHaveBeenCalledTimes(1)
  await act(async () => vi.advanceTimersByTime(3000))
  expect(onComplete).toHaveBeenCalledTimes(1)
  await act(async () => timer!.reset())
  expect(host.textContent).toBe('1')
  await act(async () => vi.advanceTimersByTime(1000))
  expect(onComplete).toHaveBeenCalledTimes(2)
})

it('uses the latest callback without restarting an active countdown', async () => {
  vi.useFakeTimers()
  const first = vi.fn()
  const latest = vi.fn()
  await act(async () => root.render(<Timer duration={2} onComplete={first} />))
  await act(async () => vi.advanceTimersByTime(1000))
  await act(async () => root.render(<Timer duration={2} onComplete={latest} />))
  await act(async () => vi.advanceTimersByTime(1000))
  expect(first).not.toHaveBeenCalled()
  expect(latest).toHaveBeenCalledTimes(1)
})

it('can start another run from the completion callback through setRemaining', async () => {
  vi.useFakeTimers()
  let timer: ReturnType<typeof useTimer>
  let completions = 0
  const complete = vi.fn(() => {
    completions += 1
    if (completions === 1) timer.setRemaining(1)
  })
  function Harness() {
    timer = useTimer({ duration: 1, onComplete: complete })
    return <output>{timer.remaining}</output>
  }
  await act(async () => root.render(<Harness />))
  await act(async () => vi.advanceTimersByTime(1000))
  expect(complete).toHaveBeenCalledTimes(1)
  expect(host.textContent).toBe('1')
  await act(async () => vi.advanceTimersByTime(1000))
  expect(complete).toHaveBeenCalledTimes(2)
  expect(host.textContent).toBe('0')
})

it('resets to a bounded duration without treating an explicit zero as completion', async () => {
  vi.useFakeTimers()
  const done = vi.fn()
  await act(async () => root.render(<Timer duration={2} onComplete={done} />))
  await act(async () => root.render(<Timer duration={0} onComplete={done} />))
  await act(async () => vi.advanceTimersByTime(2000))
  expect(done).not.toHaveBeenCalled()
  await act(async () => root.render(<Timer duration={4000} onComplete={done} />))
  expect(host.querySelector('[role="timer"]')?.textContent).toBe('59:59')
  const circle = host.querySelectorAll('circle')[1]
  expect(Number(circle.getAttribute('stroke-dashoffset'))).toBe(0)
})

it('exposes timer help on focus and dismisses it with Escape', async () => {
  await act(async () => root.render(<Timer duration={60} state="paused" tooltip="Time to waypoint" />))
  const trigger = host.querySelector<HTMLElement>('[tabindex="0"]')!
  await act(async () => trigger.focus())
  const tooltip = document.querySelector('[role="tooltip"]')!
  expect(tooltip.textContent).toBe('Time to waypoint')
  expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id)
  await act(async () => trigger.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })))
  expect(document.querySelector('[role="tooltip"]')).not.toBeNull()
  await act(async () => trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
})

it('expands the help target with the control-size token while keeping its ring 32px', async () => {
  const previous = document.documentElement.style.getPropertyValue('--control-size')
  document.documentElement.style.setProperty('--control-size', '44px')
  try {
    await act(async () => root.render(<Timer duration={60} state="paused" tooltip="Time to waypoint" />))
    const trigger = host.querySelector<HTMLElement>('.widget-timer-trigger')!
    expect(trigger.getBoundingClientRect().width).toBe(44)
    expect(trigger.getBoundingClientRect().height).toBe(44)
    const ring = trigger.querySelector('svg')!
    expect(ring.getBoundingClientRect().width).toBe(32)
    expect(ring.getBoundingClientRect().height).toBe(32)
  } finally {
    if (previous) document.documentElement.style.setProperty('--control-size', previous)
    else document.documentElement.style.removeProperty('--control-size')
  }
})

it('keeps timer help available while the pointer crosses the gap and hovers the tooltip', async () => {
  vi.useFakeTimers()
  await act(async () => root.render(<Timer duration={60} state="paused" tooltip="Time to waypoint" />))
  const trigger = host.querySelector<HTMLElement>('.widget-timer-trigger')!
  await act(async () => trigger.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })))
  const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')!
  expect(tooltip.textContent).toBe('Time to waypoint')

  await act(async () => trigger.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })))
  await act(async () => vi.advanceTimersByTime(100))
  expect(document.querySelector('[role="tooltip"]')).not.toBeNull()
  await act(async () => tooltip.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })))
  await act(async () => vi.advanceTimersByTime(500))
  expect(document.querySelector('[role="tooltip"]')).not.toBeNull()

  await act(async () => tooltip.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })))
  await act(async () => vi.advanceTimersByTime(250))
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
})
