import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ExternalControlExample } from './ExternalControlExample'
import '../styles/theme.css'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let container: HTMLDivElement
let root: Root
beforeEach(async () => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  await act(async () => root.render(<ExternalControlExample />))
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.restoreAllMocks()
})
const click = async (name: string) => {
  const button = container.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)
  expect(button).not.toBeNull()
  await act(async () => button!.click())
}
const hostState = () => JSON.parse(container.querySelector('[aria-label="Host state input"]')!.textContent!)
const resolved = () => JSON.parse(container.querySelector('[aria-label="Resolved presentation"]')!.textContent!)
const selectMission = async (value: string) => {
  const select = container.querySelector('select')!
  await act(async () => {
    select.value = value
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

it('external mission changes resolve a new configuration and its available controls', async () => {
  expect(resolved().actions).toEqual(['refresh', 'prev', 'next', 'settings'])
  await selectMission('returning-to-dock')
  expect(hostState()).toMatchObject({ action: 'returning-to-dock', time: 240 })
  expect(resolved()).toEqual({ status: 'Returning to Dock', timerIcon: 'ArrowTurnDownLeftIcon', actions: [] })
  expect(container.querySelector('[aria-label="Expand"]')).toBeNull()
  expect(container.querySelector('[aria-label="Mission actions"]')).toBeNull()
})

it('widget pause proposals update the external state and the configuration readout', async () => {
  await click('Pause')
  expect(hostState().isPaused).toBe(true)
  expect(resolved().status).toBe('Mission Paused')
  expect(resolved().actions).toEqual(['exit-mission'])
  expect(container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.checked).toBe(true)
  expect(container.querySelector('[aria-label="Callback history"]')!.textContent).toContain('onStateChange')
  await click('Resume')
  expect(hostState().isPaused).toBe(false)
})

it('mission actions deliver their typed intent payload without changing the mission', async () => {
  await click('Refresh waypoint')
  const event = container.querySelector('.docs-lab-event-value')!
  expect(JSON.parse(event.textContent!)).toEqual({ type: 'mission-action', action: 'waypoint-mission', id: 'refresh' })
  expect(hostState().action).toBe('waypoint-mission')
})

it('orbit carets update the host state and report the same bounded callback value', async () => {
  await selectMission('orbiting')
  for (let index = 0; index < 4; index++) await click('Increase orbit progress')
  expect(hostState().orbitProgress).toBe(100)
  expect(container.querySelector<HTMLButtonElement>('[aria-label="Increase orbit progress"]')!.disabled).toBe(true)
  const callbacks = [...container.querySelectorAll('.docs-lab-event-list li')]
  expect(callbacks).toHaveLength(4)
  expect(callbacks.at(-1)!.textContent).toBe('onOrbitProgressChange100')
  await click('Decrease orbit progress')
  expect(hostState().orbitProgress).toBe(95)
  expect(container.querySelector('[role="meter"]')!.getAttribute('aria-valuenow')).toBe('95')
})

it('host controls update supplied props without manufacturing widget callbacks', async () => {
  const [paused, expanded] = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
  await act(async () => expanded.click())
  expect(hostState().expanded).toBe(false)
  expect(container.querySelector('[aria-label="Expand"]')).not.toBeNull()
  await act(async () => paused.click())
  expect(hostState().isPaused).toBe(true)
  expect(container.querySelector('[aria-label="Resume"]')).not.toBeNull()
  await selectMission('orbiting')
  const range = container.querySelector<HTMLInputElement>('input[type="range"]')!
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    setter.call(range, '30')
    range.dispatchEvent(new Event('input', { bubbles: true }))
  })
  expect(hostState().orbitProgress).toBe(30)
  expect(container.querySelector('.docs-lab-event-name')).toBeNull()
})
