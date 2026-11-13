import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  AutonomyWidgetActionEvent,
  AutonomyWidgetContextType,
  AutonomyWidgetState,
  AutonomyWidgetStateInput,
} from './AutonomyWidget.types'
import { createAutonomyWidgetState } from './AutonomyWidget.state'
import { AutonomyWidgetContext } from './AutonomyWidget.context'

interface SharedProviderProps {
  children: ReactNode
  /** Observe command intent; transport and acknowledgment belong to the application. */
  onAction?: (event: AutonomyWidgetActionEvent) => void
  /** Observe orbit adjustments after the shared state has been updated. */
  onOrbitProgressChange?: (progress: number) => void
}

/** Choose initial local state or a controlled state/onStateChange pair. */
export type AutonomyWidgetProviderProps = SharedProviderProps & (
  | {
      initialState?: AutonomyWidgetStateInput
      state?: never
      onStateChange?: (state: AutonomyWidgetState) => void
    }
  | {
      state: AutonomyWidgetStateInput
      onStateChange: (state: AutonomyWidgetState) => void
      initialState?: never
    }
)

/**
 * Provides controlled or local mission state without a placeholder first frame.
 *
 * @remarks
 * `initialState` is read on mount. Use `state` and `onStateChange` when an
 * application owns the state. Callback events express UI intent; the provider
 * does not send commands to an external system.
 */
export const AutonomyWidgetProvider = ({
  children,
  initialState,
  state,
  onStateChange,
  onAction,
  onOrbitProgressChange,
}: AutonomyWidgetProviderProps) => {
  const [internalState, setInternalState] = useState(() => createAutonomyWidgetState(
    initialState ?? state ?? { action: 'waypoint-mission', time: 90 },
  ))
  const controlled = state !== undefined
  const resolvedState = useMemo(() => state ? createAutonomyWidgetState(state) : internalState, [state, internalState])
  const currentState = useRef(resolvedState)
  const authoritativeState = useRef(resolvedState)
  const rebasePending = useRef(false)
  const onChange = useRef(onStateChange)
  useLayoutEffect(() => {
    currentState.current = resolvedState
    authoritativeState.current = resolvedState
    onChange.current = onStateChange
  }, [resolvedState, onStateChange])

  const setState: AutonomyWidgetContextType['setState'] = useCallback(update => {
    const input = typeof update === 'function' ? update(currentState.current) : update
    const next = createAutonomyWidgetState(input)
    // Compose updates in one event before React renders the owner's next value.
    currentState.current = next
    if (!controlled) {
      setInternalState(next)
    } else if (!rebasePending.current) {
      rebasePending.current = true
      queueMicrotask(() => {
        rebasePending.current = false
        // A declined proposal must not become the basis of the next event.
        currentState.current = authoritativeState.current
      })
    }
    onChange.current?.(next)
  }, [controlled])

  const value = useMemo(() => ({
    state: resolvedState, setState, onAction, onOrbitProgressChange,
  }), [resolvedState, setState, onAction, onOrbitProgressChange])

  return <AutonomyWidgetContext.Provider value={value}>{children}</AutonomyWidgetContext.Provider>
}
