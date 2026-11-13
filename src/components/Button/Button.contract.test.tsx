import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { Controls } from '../Controls/Controls'
import '../../styles/theme.css'

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
  vi.restoreAllMocks()
})

it('forwards native attributes and a focusable native button ref', async () => {
  const ref = createRef<HTMLButtonElement>()
  const onClick = vi.fn()
  await act(async () => root.render(
    <Button ref={ref} aria-label="Inspect mission" data-command="inspect" aria-controls="details" aria-expanded={false} onClick={onClick} className="demo-control">
      Inspect
    </Button>
  ))
  const button = host.querySelector('button')!
  expect(ref.current).toBe(button)
  expect(button.type).toBe('button')
  expect(button.dataset.command).toBe('inspect')
  expect(button.getAttribute('aria-controls')).toBe('details')
  expect(button.getAttribute('aria-expanded')).toBe('false')
  expect(button.classList.contains('demo-control')).toBe(true)
  await act(async () => ref.current!.focus())
  expect(document.activeElement).toBe(button)
  await act(async () => button.click())
  expect(onClick).toHaveBeenCalledTimes(1)
})

it('associates help while focused and dismisses it with Escape', async () => {
  const keyDown = vi.fn()
  await act(async () => root.render(<Button ariaLabel="Play" tooltip="Resume the mission" aria-describedby="existing-help" onKeyDown={keyDown} />))
  const button = host.querySelector('button')!
  await act(async () => button.focus())
  const tooltip = document.querySelector('[role="tooltip"]')!
  expect(tooltip.textContent).toBe('Resume the mission')
  expect(button.getAttribute('aria-describedby')?.split(' ')).toEqual(['existing-help', tooltip.id])
  await act(async () => button.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true})))
  expect(keyDown).toHaveBeenCalledTimes(1)
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
  expect(button.getAttribute('aria-describedby')).toBe('existing-help')
  await act(async () => button.blur())
  await act(async () => button.focus())
  expect(document.querySelector('[role="tooltip"]')?.textContent).toBe('Resume the mission')
})

it('keeps help visible while focused after the pointer leaves', async () => {
  await act(async () => root.render(<Button ariaLabel="Play" tooltip="Resume" />))
  const button = host.querySelector('button')!
  await act(async () => button.dispatchEvent(new MouseEvent('mouseover', {bubbles:true})))
  await act(async () => button.focus())
  await act(async () => button.dispatchEvent(new MouseEvent('mouseout', {bubbles:true})))
  expect(document.querySelector('[role="tooltip"]')).not.toBeNull()
  await act(async () => button.blur())
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
})

it('renders valid named controls without supplying a button configuration', async () => {
  const errors = vi.spyOn(console, 'error')
  await act(async () => root.render(<Controls />))
  const names = [...host.querySelectorAll('button')].map(button => button.getAttribute('aria-label'))
  expect(names).toEqual(['Refresh waypoint', 'Previous waypoint', 'Next waypoint', 'Waypoint settings'])
  expect(errors).not.toHaveBeenCalled()
})

it('keeps help open while the pointer crosses the gap and reads the tooltip', async () => {
  vi.useFakeTimers()
  await act(async () => root.render(<Button ariaLabel="Inspect" tooltip="Inspect the mission" />))
  const button = host.querySelector('button')!
  await act(async () => button.dispatchEvent(new MouseEvent('mouseover', {bubbles:true})))
  const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')!
  expect(getComputedStyle(tooltip).pointerEvents).toBe('auto')
  await act(async () => button.dispatchEvent(new MouseEvent('mouseout', {bubbles:true})))
  await act(async () => vi.advanceTimersByTime(100))
  expect(document.getElementById(tooltip.id)).not.toBeNull()
  await act(async () => tooltip.dispatchEvent(new MouseEvent('mouseover', {bubbles:true})))
  await act(async () => vi.advanceTimersByTime(1000))
  expect(document.getElementById(tooltip.id)).not.toBeNull()
  expect(button.getAttribute('aria-describedby')).toBe(tooltip.id)
  expect(tooltip.hasAttribute('tabindex')).toBe(false)
  await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true})))
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
  expect(button.hasAttribute('aria-describedby')).toBe(false)
  await act(async () => vi.advanceTimersByTime(1000))
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
  await act(async () => button.dispatchEvent(new MouseEvent('mouseover', {bubbles:true})))
  expect(document.querySelector('[role="tooltip"]')).not.toBeNull()
})

it('closes help after the pointer leaves both trigger and tooltip', async () => {
  vi.useFakeTimers()
  await act(async () => root.render(<Button ariaLabel="Inspect" tooltip="Inspect the mission" />))
  const button = host.querySelector('button')!
  await act(async () => button.dispatchEvent(new MouseEvent('mouseover', {bubbles:true})))
  const tooltip = document.querySelector('[role="tooltip"]')!
  await act(async () => button.dispatchEvent(new MouseEvent('mouseout', {bubbles:true})))
  await act(async () => tooltip.dispatchEvent(new MouseEvent('mouseover', {bubbles:true})))
  await act(async () => tooltip.dispatchEvent(new MouseEvent('mouseout', {bubbles:true})))
  await act(async () => vi.advanceTimersByTime(250))
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
  expect(button.hasAttribute('aria-describedby')).toBe(false)
})
