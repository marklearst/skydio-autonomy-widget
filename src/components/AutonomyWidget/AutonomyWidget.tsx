import { useCallback, useId, useLayoutEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'framer-motion'
import { Timer, Button, StatusMessage, OrbitSlider } from 'components'
import { useBreakpoint } from 'hooks'
import { useMotionTokens, type MotionTokens } from '../../hooks/useMotionTokens'
import { useAutonomyWidget } from './hooks/useAutonomyWidget'
import { getActionConfig } from './AutonomyWidget.configs'
import type { ActionButton } from './AutonomyWidget.types'
import {
  OrbitIcon, ArrowTurnDownLeftIcon, ArrowDownToLineIcon,
  BinocularsIcon, RouteIcon, XSquareIcon, type IconName,
} from 'icons'

const timerIcons = {
  NavigationIcon: RouteIcon,
  HomeIcon: ArrowTurnDownLeftIcon,
  OrbitIcon,
  ArrowDown: ArrowDownToLineIcon,
  UserIcon: BinocularsIcon,
  ManualIcon: XSquareIcon,
  ClockIcon: XSquareIcon,
  RouteIcon,
  ArrowTurnDownLeftIcon,
  ArrowDownToLineIcon,
  BinocularsIcon,
  XSquareIcon,
}

const StatusHandoff = ({ message, timing }: { message: string; timing: MotionTokens }) => {
  return (
    <motion.div
      className="absolute inset-0"
      aria-hidden="true"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, transition: { duration: timing.fast } }}
      transition={{ duration: timing.feedback, ease: timing.ease }}>
      <StatusMessage message={message} />
    </motion.div>
  )
}

const useActionRowFocus = (present: boolean, onExitFocus: () => void) => {
  const rowRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!present && rowRef.current?.contains(document.activeElement)) onExitFocus()
  }, [present, onExitFocus])
  useLayoutEffect(() => {
    const row = rowRef.current
    return () => {
      if (!row?.contains(document.activeElement)) return
      // Let the same commit remove an obsolete disclosure before choosing its fallback.
      queueMicrotask(() => {
        if (document.activeElement === document.body || row.contains(document.activeElement)) onExitFocus()
      })
    }
  }, [onExitFocus])
  return rowRef
}

const StaticActionRow = ({ id, children, onExitFocus }: {
  id: string
  children: ReactNode
  onExitFocus: () => void
}) => {
  const rowRef = useActionRowFocus(true, onExitFocus)
  return (
    <div ref={rowRef} id={id} className="px-(--widget-padding) pb-(--widget-padding) w-full" role="group" aria-label="Mission actions">
      <div className="flex flex-row gap-2">{children}</div>
    </div>
  )
}

const ActionRow = ({ id, children, timing, onExitFocus }: {
  id: string
  children: ReactNode
  timing: MotionTokens
  onExitFocus: () => void
}) => {
  const present = useIsPresent()
  const rowRef = useActionRowFocus(present, onExitFocus)

  return (
    <motion.div
      ref={rowRef}
      id={present ? id : undefined}
      role={present ? 'group' : undefined}
      aria-label={present ? 'Mission actions' : undefined}
      aria-hidden={!present || undefined}
      inert={!present}
      className="absolute inset-x-0 px-(--widget-padding) pb-(--widget-padding)"
      style={{
        top: 'calc(var(--widget-height) - 2 * var(--widget-border-width))',
        pointerEvents: present ? 'auto' : 'none',
      }}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, transition: { duration: timing.fast } }}
      transition={{ duration: timing.normal, ease: timing.ease }}>
      <div className="flex flex-row gap-2">{children}</div>
    </motion.div>
  )
}

/**
 * Mission status and controls backed by the nearest widget provider.
 *
 * @remarks
 * Pause and expansion update shared state. Action buttons emit command intent;
 * application callbacks own transport and acknowledgment. Compact mode is based
 * on viewport width and removes the secondary control row from the tab order.
 */
export const AutonomyWidget: React.FC = () => {
  const { state, setState, onAction, onOrbitProgressChange } = useAutonomyWidget()
  const { action, actionName, time, expanded, isPaused, buttons, timerIcon } = state
  const isCompact = useBreakpoint(600)
  const controlsId = useId()
  const disclosureRef = useRef<HTMLButtonElement>(null)
  const pauseRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  const timing = useMotionTokens()
  const layoutTransition = { type: 'spring' as const, duration: timing.layout, bounce: 0 }
  const config = getActionConfig(action)
  const currentActionName = isPaused ? config.pausedName || 'Mission Paused' : actionName
  const currentButtons = isPaused ? config.pausedButtons || [] : buttons
  const hasButtons = currentButtons.length > 0
  const showControls = expanded && hasButtons && !isCompact
  const actionRowKey = `${action}:${isPaused ? 'paused' : 'running'}`
  const TimerIcon = timerIcons[(timerIcon || 'NavigationIcon') as keyof typeof timerIcons] || XSquareIcon
  const restoreActionFocus = useCallback(() => (disclosureRef.current ?? pauseRef.current)?.focus(), [])

  const handleAction = (button: ActionButton) => {
    button.onClick?.()
    onAction?.({ type: 'mission-action', action, id: button.id })
  }

  const handleOrbitChange = (progress: number) => {
    setState(previous => ({ ...previous, orbitProgress: progress }))
    onOrbitProgressChange?.(progress)
  }

  const actionControls = currentButtons.map(button => button.component === 'orbit-slider' ? (
    <OrbitSlider
      key={button.id}
      min={0} max={100} step={5}
      value={state.orbitProgress ?? 50}
      onChange={handleOrbitChange}
    />
  ) : (
    <Button
      key={button.id}
      icon={button.icon as IconName}
      label={button.label || undefined}
      variant={button.variant}
      ariaLabel={button.ariaLabel || button.label}
      tooltip={button.tooltip || (!button.label ? button.ariaLabel : undefined)}
      onClick={() => handleAction(button)}
      size={button.label ? 'auto' : 32}
      flex
    />
  ))

  return (
    <motion.div
      className="autonomy-widget-base"
      layout={reducedMotion ? false : 'position'}
      initial={false}
      transition={{ layout: layoutTransition }}
      role="group"
      aria-label="Autonomy controls"
      data-expanded={showControls}
      data-compact={isCompact}>
      <motion.div
        className="autonomy-widget-surface"
        aria-hidden="true"
        layout={!reducedMotion}
        initial={false}
        style={{ originY: 0 }}
        transition={{ layout: layoutTransition }}
      />
      <div className="autonomy-widget-header flex justify-between items-center w-full gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{currentActionName}</span>
          <Timer
            duration={time}
            state={isPaused ? 'paused' : 'running'}
            icon={TimerIcon}
            tooltip={isCompact ? config.actionTooltip : undefined}
          />
          {!isCompact && (
            <div className="min-w-0 flex-1 relative h-5 overflow-hidden" aria-hidden="true">
              {reducedMotion ? <StatusMessage message={currentActionName} /> : (
                <AnimatePresence initial={false}>
                  <StatusHandoff key={currentActionName} message={currentActionName} timing={timing} />
                </AnimatePresence>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isCompact && hasButtons && (
            <Button
              ref={disclosureRef}
              icon={showControls ? 'ChevronUpIcon' : 'ChevronDownIcon'}
              tooltip={showControls ? 'Collapse controls' : 'View controls'}
              variant="caret-borderless"
              ariaLabel={showControls ? 'Collapse' : 'Expand'}
              aria-expanded={showControls}
              aria-controls={controlsId}
              onClick={() => setState(previous => ({ ...previous, expanded: !previous.expanded }))}
            />
          )}
          <Button
            ref={pauseRef}
            icon={isPaused ? 'PlayIcon' : 'StopSignIcon'}
            variant={isPaused ? 'play-borderless' : 'stop-borderless'}
            tooltip={isPaused ? 'Resume mission' : 'Pause mission'}
            ariaLabel={isPaused ? 'Resume' : 'Pause'}
            onClick={() => setState(previous => ({ ...previous, isPaused: !previous.isPaused }))}
          />
        </div>
      </div>
      {reducedMotion ? showControls && (
        <StaticActionRow key={actionRowKey} id={controlsId} onExitFocus={restoreActionFocus}>
          {actionControls}
        </StaticActionRow>
      ) : (
        <AnimatePresence initial={false}>
          {showControls && (
            <ActionRow
              key={actionRowKey}
              id={controlsId}
              timing={timing}
              onExitFocus={restoreActionFocus}>
              {actionControls}
            </ActionRow>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}
