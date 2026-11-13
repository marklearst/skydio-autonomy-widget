import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { AutonomyWidget } from './AutonomyWidget'
import { AutonomyWidgetProvider } from './AutonomyWidget.provider'
import { OrbitSlider } from '../OrbitSlider/OrbitSlider'
import '../../styles/theme.css'

const preference = vi.hoisted(() => ({ reduced: false }))
vi.mock('framer-motion', async importOriginal => ({
  ...await importOriginal<typeof import('framer-motion')>(),
  useReducedMotion: () => preference.reduced,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let host: HTMLDivElement
let root: Root
let viewportWidth: number

beforeEach(() => {
  preference.reduced = false
  viewportWidth = window.innerWidth
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
  host = document.createElement('div')
  host.style.width = '240px'
  document.body.append(host)
  root = createRoot(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: viewportWidth })
})

const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))
const pointerClick = async (name: string) => {
  const button = host.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!
  await act(async () => button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })))
}
const liveRow = () => host.querySelector<HTMLElement>('[role="group"][aria-label="Mission actions"]')
const renderWidget = async (expanded = false) => act(async () => root.render(
  <AutonomyWidgetProvider initialState={{ action: 'waypoint-mission', time: 90, expanded }}>
    <AutonomyWidget />
  </AutonomyWidgetProvider>,
))

it('opens its surface around an anchored header without scaling live text', async () => {
  await renderWidget()
  await frame()
  const base = host.querySelector<HTMLElement>('.autonomy-widget-base')!
  const header = host.querySelector<HTMLElement>('.autonomy-widget-header')!
  const surface = host.querySelector<HTMLElement>('.autonomy-widget-surface')!
  const original = header.getBoundingClientRect()
  expect(surface.getBoundingClientRect().height).toBeCloseTo(48)

  await pointerClick('Expand')
  await frame()
  await frame()
  expect(getComputedStyle(base).height).toBe('88px')
  expect(surface.getBoundingClientRect().height).toBeGreaterThan(48)
  expect(surface.getBoundingClientRect().height).toBeLessThan(88)
  const during = header.getBoundingClientRect()
  expect(during.top).toBeCloseTo(original.top)
  expect(during.height).toBeCloseTo(original.height)
  expect(getComputedStyle(header).transform).toBe('none')
  expect(liveRow()).not.toBeNull()

  await wait(280)
  expect(surface.getBoundingClientRect().height).toBeCloseTo(88)
})

it('smoothly follows parent centering instead of jumping the header when height changes', async () => {
  Object.assign(host.style, { width: '400px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' })
  await renderWidget()
  await frame()
  const header = host.querySelector<HTMLElement>('.autonomy-widget-header')!
  const surface = host.querySelector<HTMLElement>('.autonomy-widget-surface')!
  const original = header.getBoundingClientRect()
  const originalSurface = surface.getBoundingClientRect()
  expect(getComputedStyle(host.querySelector('.autonomy-widget-base')!).transform).toBe('none')

  await pointerClick('Expand')
  await frame()
  await frame()
  const during = header.getBoundingClientRect()
  expect(original.top - during.top).toBeGreaterThan(0)
  expect(original.top - during.top).toBeLessThan(20)
  expect(during.height).toBeCloseTo(original.height)
  const growingSurface = surface.getBoundingClientRect()
  expect(growingSurface.top).toBeCloseTo(during.top - 1)
  expect(growingSurface.top + growingSurface.height / 2).toBeCloseTo(originalSurface.top + originalSurface.height / 2)
  await wait(280)
  expect(header.getBoundingClientRect().top).toBeCloseTo(original.top - 20)

  await pointerClick('Collapse')
  expect(liveRow()).toBeNull()
  await frame()
  await frame()
  const returning = header.getBoundingClientRect().top
  expect(returning).toBeGreaterThan(original.top - 20)
  expect(returning).toBeLessThan(original.top)
  await wait(280)
  expect(header.getBoundingClientRect().top).toBeCloseTo(original.top)
})

it('removes exiting actions from focus and accessibility immediately while the visual settles', async () => {
  await renderWidget(true)
  const row = liveRow()!
  await act(async () => row.querySelector<HTMLButtonElement>('button')!.focus())
  await pointerClick('Collapse')
  expect(liveRow()).toBeNull()
  expect(row.inert).toBe(true)
  expect(row.getAttribute('aria-hidden')).toBe('true')
  expect(row.id).toBe('')
  expect(row.style.pointerEvents).toBe('none')
  expect(document.activeElement?.getAttribute('aria-label')).toBe('Expand')
  await wait(180)
  expect(row.isConnected).toBe(false)
})

it('hands off paused status and controls without two live rows or a delayed action target', async () => {
  await renderWidget(true)
  const oldRow = liveRow()!
  const header = host.querySelector<HTMLElement>('.autonomy-widget-header')!
  const original = header.getBoundingClientRect()
  await pointerClick('Pause')
  expect(host.querySelector('button[aria-label="Resume"]')).not.toBeNull()
  expect(liveRow()?.textContent).toContain('Exit Mission')
  expect(liveRow()?.inert).toBe(false)
  expect(oldRow.inert).toBe(true)
  expect(oldRow.getAttribute('aria-hidden')).toBe('true')
  expect(host.querySelectorAll('[role="group"][aria-label="Mission actions"]').length).toBe(1)
  expect(header.getBoundingClientRect().top).toBeCloseTo(original.top)
  expect(header.getBoundingClientRect().height).toBeCloseTo(original.height)
  const liveStatuses = [...host.querySelectorAll('[role="status"]')]
    .filter(element => !element.closest('[aria-hidden="true"]'))
  expect(liveStatuses).toHaveLength(1)
  expect(liveStatuses[0].textContent).toBe('Mission Paused')
})

it('updates one persistent status region through pause and resume while visual copies stay hidden', async () => {
  await renderWidget()
  const status = host.querySelector<HTMLElement>('.sr-only[role="status"]')!
  expect(status.textContent).toBe('Flying to Point 1')
  await pointerClick('Pause')
  expect(host.querySelector('.sr-only[role="status"]')).toBe(status)
  expect(status.textContent).toBe('Mission Paused')
  await pointerClick('Resume')
  expect(host.querySelector('.sr-only[role="status"]')).toBe(status)
  expect(status.textContent).toBe('Flying to Point 1')
  const visibleToAssistiveTechnology = [...host.querySelectorAll('[role="status"]')]
    .filter(element => !element.closest('[aria-hidden="true"]'))
  expect(visibleToAssistiveTechnology).toEqual([status])
})

it('restores focus when a reduced-motion action row is replaced or removed for compact mode', async () => {
  preference.reduced = true
  await renderWidget(true)
  await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Refresh waypoint"]')!.focus())
  await pointerClick('Pause')
  expect(document.activeElement?.getAttribute('aria-label')).toBe('Collapse')
  expect(liveRow()?.textContent).toContain('Exit Mission')

  await act(async () => liveRow()!.querySelector<HTMLButtonElement>('button')!.focus())
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 400 })
  await act(async () => window.dispatchEvent(new Event('resize')))
  expect(liveRow()).toBeNull()
  expect(document.activeElement?.getAttribute('aria-label')).toBe('Resume')
})

const thumbPercent = () => {
  const track = host.querySelector<HTMLElement>('[role="meter"]')!.getBoundingClientRect()
  const thumb = host.querySelector<HTMLElement>('.orbit-indicator > div')!.getBoundingClientRect()
  return (thumb.left + thumb.width / 2 - track.left) / track.width * 100
}

it('retargets orbit travel from its current position while exposing the new value immediately', async () => {
  await act(async () => root.render(<OrbitSlider value={50} />))
  expect(thumbPercent()).toBeCloseTo(50)
  await act(async () => root.render(<OrbitSlider value={80} />))
  expect(host.querySelector('[role="meter"]')?.getAttribute('aria-valuenow')).toBe('80')
  await wait(50)
  const outward = thumbPercent()
  expect(outward).toBeGreaterThan(50)
  expect(outward).toBeLessThan(80)
  act(() => root.render(<OrbitSlider value={20} />))
  expect(thumbPercent()).toBeCloseTo(outward, 0)
  await wait(70)
  expect(thumbPercent()).toBeLessThan(outward)
  await wait(200)
  expect(thumbPercent()).toBeCloseTo(20)
})

it('accepts four pointer adjustments during travel and settles native keyboard activation immediately', async () => {
  const changed = vi.fn()
  function Harness() {
    const [value, setValue] = useState(50)
    return <OrbitSlider value={value} step={5} onChange={next => { changed(next); setValue(next) }} />
  }
  await act(async () => root.render(<Harness />))
  for (let click = 0; click < 4; click += 1) await pointerClick('Decrease orbit progress')
  expect(changed.mock.calls.map(([value]) => value)).toEqual([45, 40, 35, 30])
  expect(host.querySelector('[role="meter"]')?.getAttribute('aria-valuenow')).toBe('30')
  await wait(240)
  expect(thumbPercent()).toBeCloseTo(30)

  await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Decrease orbit progress"]')!.click())
  await frame()
  expect(thumbPercent()).toBeCloseTo(25)
})

it('settles expansion and orbit immediately when reduced motion is requested', async () => {
  preference.reduced = true
  Object.assign(host.style, { width: '400px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' })
  await renderWidget(true)
  const header = host.querySelector<HTMLElement>('.autonomy-widget-header')!
  const expandedTop = header.getBoundingClientRect().top
  await pointerClick('Collapse')
  expect(liveRow()).toBeNull()
  expect(host.querySelector('[inert]')).toBeNull()
  expect(host.querySelector<HTMLElement>('.autonomy-widget-surface')!.getBoundingClientRect().height).toBeCloseTo(48)
  expect(header.getBoundingClientRect().top).toBeCloseTo(expandedTop + 20)
  expect(getComputedStyle(host.querySelector('.autonomy-widget-base')!).transform).toBe('none')

  Object.assign(host.style, { width: '240px', height: '', display: '', alignItems: '', justifyContent: '' })
  await act(async () => root.render(<OrbitSlider value={50} />))
  await act(async () => root.render(<OrbitSlider value={80} />))
  await frame()
  expect(thumbPercent()).toBeCloseTo(80)
})
