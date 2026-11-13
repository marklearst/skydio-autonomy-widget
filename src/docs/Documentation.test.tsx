import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { IntegrationExample } from './IntegrationExample'
import { TokenReference } from './TokenReference'
import '../styles/theme.css'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let container: HTMLDivElement
let root: Root
beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.restoreAllMocks()
})

it('the documented minimal integration renders and preserves mission controls', async () => {
  await act(async () => root.render(<IntegrationExample />))
  expect(container.textContent).toContain('Flying to Point 1')
  await act(async () => container.querySelector<HTMLButtonElement>('[aria-label="Pause"]')!.click())
  expect(container.textContent).toContain('Mission Paused')
  await act(async () => container.querySelector<HTMLButtonElement>('[aria-label="Resume"]')!.click())
  expect(container.querySelector('[aria-label="Pause"]')).not.toBeNull()
})

it('the token reference reads the active CSS and refreshes when pointer geometry changes', async () => {
  const pointer = new EventTarget() as MediaQueryList
  const matchMedia = window.matchMedia.bind(window)
  vi.spyOn(window, 'matchMedia').mockImplementation(query => query === '(pointer: coarse)' ? pointer : matchMedia(query))
  const originalSize = document.documentElement.style.getPropertyValue('--control-size')
  try {
    await act(async () => root.render(<TokenReference />))
    const row = (name: string) => [...container.querySelectorAll('tbody tr')].find(element => element.querySelector('code')?.textContent === name)!
    expect(row('--color-surface').textContent).toContain('#1a1a1a')
    expect(container.textContent).not.toContain('Reading stylesheet')
    document.documentElement.style.setProperty('--control-size', '44px')
    await act(async () => pointer.dispatchEvent(new Event('change')))
    expect(row('--control-size').textContent).toContain('44px')
  } finally {
    if (originalSize) document.documentElement.style.setProperty('--control-size', originalSize)
    else document.documentElement.style.removeProperty('--control-size')
  }
})
