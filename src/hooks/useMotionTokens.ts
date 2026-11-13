import { useState } from 'react'

type Curve = [number, number, number, number] | 'linear'

export interface MotionTokens {
  fast: number
  normal: number
  layout: number
  feedback: number
  ease: Curve
}

const seconds = (value: string) => {
  const numeric = Number.parseFloat(value)
  if (!Number.isFinite(numeric) || numeric < 0) return 0
  const token = value.trim()
  if (token.endsWith('ms')) return numeric / 1000
  return token.endsWith('s') ? numeric : 0
}

// Motion takes seconds and a numeric curve; CSS remains the timing source.
const readMotionTokens = (): MotionTokens => {
  if (typeof document === 'undefined') return { fast: 0, normal: 0, layout: 0, feedback: 0, ease: 'linear' }
  const styles = getComputedStyle(document.documentElement)
  const duration = (name: string) => seconds(styles.getPropertyValue(name))
  const curve = styles.getPropertyValue('--ease-out-ui').trim()
  const values = curve.startsWith('cubic-bezier(')
    ? curve.slice(13, -1).split(',').map(Number)
    : []
  const normal = duration('--duration-normal')
  return {
    fast: duration('--duration-fast'),
    normal,
    layout: duration('--duration-layout') || normal,
    feedback: duration('--duration-feedback') || normal,
    ease: values.length === 4 && values.every(Number.isFinite)
      ? values as [number, number, number, number]
      : 'linear',
  }
}

/** Resolve semantic CSS timing values once per mounted motion surface. */
export const useMotionTokens = () => {
  const [tokens] = useState(readMotionTokens)
  return tokens
}
