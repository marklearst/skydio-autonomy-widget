import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ArchitectureDiagram, MissionConfigExplorer } from './ArchitectureReference'
import { ComponentStates, GeometryReference, MotionStudy, TokenTrace } from './DesignSystemReference'
import { ACTION_CONFIGS } from '../components/AutonomyWidget/AutonomyWidget.configs'
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
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.useRealTimers(); vi.restoreAllMocks() })
const render = async (element: React.ReactNode) => act(async () => root.render(element))
const click = async (label: string) => act(async () => [...host.querySelectorAll<HTMLButtonElement>('button')].find(button => (button.getAttribute('aria-label') || button.textContent) === label)!.click())

it('inspects actual mission configuration including entries without paused controls', async () => {
  await render(<><ArchitectureDiagram /><MissionConfigExplorer /></>)
  const source = host.querySelector('pre')!
  expect(JSON.parse(source.textContent!)).toEqual(ACTION_CONFIGS['waypoint-mission'])
  const select = host.querySelector('select')!
  await act(async () => { select.value = 'returning-to-dock'; select.dispatchEvent(new Event('change', { bubbles: true })) })
  expect(JSON.parse(source.textContent!)).toEqual(ACTION_CONFIGS['returning-to-dock'])
  expect(host.textContent).toContain('Returning to Dock')
})

it('traces the selected semantic role and follows live CSS changes', async () => {
  await render(<TokenTrace />)
  await click('Pause')
  expect(host.textContent).toContain('--color-primary-red')
  expect(host.textContent).toContain('--color-action-pause')
  const original = document.documentElement.style.getPropertyValue('--color-action-pause')
  try {
    await act(async () => { document.documentElement.style.setProperty('--color-action-pause', '#b02030') })
    expect(host.textContent).toContain('#b02030')
  } finally {
    if (original) document.documentElement.style.setProperty('--color-action-pause', original)
    else document.documentElement.style.removeProperty('--color-action-pause')
  }
})

it('uses real shared component state and disabled semantics in specimens', async () => {
  await render(<><ComponentStates /><GeometryReference /></>)
  expect([...host.querySelectorAll('button')].find(button => button.textContent === 'Unavailable')?.disabled).toBe(true)
  await click('Refresh')
  expect(host.textContent).toContain('Refresh callback received.')
  await click('Next waypoint')
  expect(host.textContent).toContain('Next waypoint callback received.')
  await click('Pause')
  expect(host.querySelector('[role="status"]')?.textContent).toBe('Mission Paused')
  await click('Resume')
  expect(host.querySelector('[role="status"]')?.textContent).toBe('Flying to Point 1')
})

it('replays one finite sequence and lets a user interrupt it', async () => {
  vi.useFakeTimers()
  await render(<MotionStudy />)
  await click('Replay transitions')
  await act(async () => { vi.advanceTimersByTime(800) })
  expect(host.querySelector('.autonomy-widget-base')?.getAttribute('data-expanded')).toBe('true')
  await click('Refresh waypoint')
  await act(async () => { vi.advanceTimersByTime(6000) })
  expect(host.querySelector('[aria-label="Pause"]')).not.toBeNull()
  expect(host.textContent).toContain('Your interaction')
  await click('Replay transitions')
  await act(async () => { vi.advanceTimersByTime(800) })
  await click('Pause')
  await act(async () => { vi.advanceTimersByTime(6000) })
  expect(host.querySelector('[aria-label="Resume"]')).not.toBeNull()
  expect(host.textContent).toContain('Your interaction')
  await click('Replay transitions')
  for (let index = 0; index < 6; index++) await act(async () => { vi.advanceTimersByTime(800) })
  expect(host.querySelector('[role="meter"]')?.getAttribute('aria-valuenow')).toBe('50')
  expect(host.textContent).toContain('Return to the center reference')
  expect(host.querySelector('button.docs-action-button')?.textContent).toBe('Replay transitions')
})
