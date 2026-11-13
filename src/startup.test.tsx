import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { expect, it, vi } from 'vitest'

vi.mock('react-dom/client', async importOriginal => {
  const original = await importOriginal<typeof import('react-dom/client')>()
  return { ...original, createRoot: vi.fn(original.createRoot) }
})

it('boots the real app entry point with working mission controls', async () => {
  const container = document.createElement('div')
  container.id = 'root'
  document.body.append(container)
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  let appRoot: Root | undefined
  try {
    await act(async () => { await import('./main') })
    appRoot = vi.mocked(createRoot).mock.results[0].value
    expect(createRoot).toHaveBeenCalledWith(container)
    expect(container.querySelector('main')).not.toBeNull()
    expect(container.textContent).toContain('Flying to Point 1')
    expect(container.querySelector('svg[role="img"]')?.getAttribute('aria-label')).toBe('Timer: 1:30 remaining')

    await act(async () => container.querySelector<HTMLButtonElement>('[aria-label="Pause"]')!.click())
    expect(container.textContent).toContain('Mission Paused')
    expect(container.querySelector('[aria-label="Resume"]')).not.toBeNull()
    await act(async () => container.querySelector<HTMLButtonElement>('[aria-label="Resume"]')!.click())
    expect(container.textContent).toContain('Flying to Point 1')
    await act(async () => container.querySelector<HTMLButtonElement>('[aria-label="Expand"]')!.click())
    for (const label of ['Refresh waypoint', 'Previous waypoint', 'Next waypoint', 'Waypoint settings']) {
      expect(container.querySelector(`[aria-label="${label}"]`)).not.toBeNull()
    }
  } finally {
    if (appRoot) await act(async () => appRoot!.unmount())
    container.remove()
    vi.restoreAllMocks()
  }
})
