import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { OrbitSlider } from './OrbitSlider'

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
})
const click = async (direction: 'Increase' | 'Decrease') => {
  await act(async () => host.querySelector<HTMLButtonElement>(`[aria-label="${direction} orbit progress"]`)!.click())
}
const current = () => Number(host.querySelector('[role="meter"]')!.getAttribute('aria-valuenow'))

it('waits for the controlled value to change before moving the indicator', async () => {
  const onChange = vi.fn()
  await act(async () => root.render(<OrbitSlider value={80} step={5} onChange={onChange} />))
  await click('Increase')
  expect(onChange).toHaveBeenLastCalledWith(85)
  expect(current()).toBe(80)
  await act(async () => root.render(<OrbitSlider value={85} step={5} onChange={onChange} />))
  expect(current()).toBe(85)
})

it('round-trips controlled changes through a consumer and disables at the upper limit', async () => {
  function Harness() {
    const [value, setValue] = useState(95)
    return <OrbitSlider value={value} onChange={setValue} step={5} />
  }
  await act(async () => root.render(<Harness />))
  await click('Increase')
  expect(current()).toBe(100)
  expect(host.querySelector<HTMLButtonElement>('[aria-label="Increase orbit progress"]')!.disabled).toBe(true)
  await click('Decrease')
  expect(current()).toBe(95)
})

it('keeps uncontrolled edits and supports legacy progress resynchronization', async () => {
  await act(async () => root.render(<OrbitSlider defaultValue={30} step={5} />))
  await click('Increase')
  expect(current()).toBe(35)
  await act(async () => root.render(<OrbitSlider defaultValue={60} step={5} />))
  expect(current()).toBe(35)
  await act(async () => root.render(<OrbitSlider progress={80} step={5} />))
  expect(current()).toBe(80)
})

it('bounds malformed ranges and values without exposing NaN', async () => {
  await act(async () => root.render(<OrbitSlider min={80} max={20} value={NaN} step={0} />))
  expect(current()).toBe(50)
  expect(host.querySelector('[role="meter"]')!.getAttribute('aria-valuemin')).toBe('20')
  expect(host.querySelector('[role="meter"]')!.getAttribute('aria-valuemax')).toBe('80')
  await act(async () => root.render(<OrbitSlider value={200} />))
  expect(current()).toBe(100)
  await act(async () => root.render(<OrbitSlider value={-20} />))
  expect(current()).toBe(0)
})
