import { Timer, Button, StatusMessage, OrbitSlider } from 'components'
import { useBreakpoint } from 'hooks'
import { useAutonomyWidget } from './hooks/useAutonomyWidget'
import { ACTION_CONFIGS } from './AutonomyWidget.configs'
import type { AutonomyWidgetState } from './AutonomyWidget.types'
import {
  OrbitIcon,
  ArrowTurnDownLeftIcon,
  ArrowDownToLineIcon,
  BinocularsIcon,
  RouteIcon,
  XSquareIcon,
  type IconName,
} from 'icons'

/**
 * AutonomyWidget is a dumb/presentational component that displays mission controls.
 * All state is managed through the AutonomyWidgetProvider context.
 *
 * @remarks
 * - Must be wrapped in AutonomyWidgetProvider to function
 * - Purely presentational - no internal state management
 * - Responsive design with compact/expanded modes
 * - Dynamic UI based on current action type
 */
// Map timer icon names to actual icon components
const getTimerIcon = (iconName: string) => {
  const iconMap: Record<
    string,
    React.ComponentType<{ width?: number; height?: number; className?: string }>
  > = {
    // Legacy mapping keys (for backward compatibility)
    NavigationIcon: RouteIcon,
    HomeIcon: ArrowTurnDownLeftIcon,
    OrbitIcon: OrbitIcon,
    ArrowDown: ArrowDownToLineIcon,
    UserIcon: BinocularsIcon,
    ManualIcon: XSquareIcon,
    ClockIcon: XSquareIcon,
    // Direct icon component names (new approach)
    RouteIcon: RouteIcon,
    ArrowTurnDownLeftIcon: ArrowTurnDownLeftIcon,
    ArrowDownToLineIcon: ArrowDownToLineIcon,
    BinocularsIcon: BinocularsIcon,
    XSquareIcon: XSquareIcon,
  }
  console.log(
    '🎯 Timer Icon Debug:',
    iconName,
    '->',
    iconMap[iconName]?.name || 'fallback'
  )
  return iconMap[iconName] || XSquareIcon
}

export const AutonomyWidget: React.FC = () => {
  const { state, setState } = useAutonomyWidget()
  const { action, actionName, time, expanded, isPaused, buttons, timerIcon } =
    state

  // Use a reasonable breakpoint that keeps timer visible at normal desktop sizes
  const isCompact = useBreakpoint(600)

  // Get the current action config to use pausedName and pausedButtons
  const currentConfig = ACTION_CONFIGS[action]
  const currentActionName = isPaused
    ? currentConfig?.pausedName || 'Mission Paused'
    : actionName

  // Use pausedButtons when paused, regular buttons when active
  const currentButtons = isPaused ? currentConfig?.pausedButtons || [] : buttons

  // Simple logic: if no buttons, don't show expand/collapse
  const hasButtons = currentButtons.length > 0
  const showExpandCollapse = hasButtons

  // Get the appropriate timer icon component
  const TimerIconComponent = getTimerIcon(timerIcon || 'NavigationIcon')

  // Generate tooltip based on paused state and Figma patterns
  const timerTooltip = isCompact
    ? isPaused
      ? currentConfig?.actionTooltip // Show time remaining when paused (e.g., "2:41")
      : currentConfig?.actionTooltip // Show short action description when running (e.g., "ETA to Dock")
    : undefined

  // Button click handler
  const handleButtonClick = (button: { id: string }) => {
    console.log('Button clicked:', button.id)
  }

  // Pause/resume handler
  const handlePauseToggle = () => {
    setState((prev: AutonomyWidgetState) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }))
  }

  // Expand/collapse handler
  const handleExpandToggle = () => {
    setState((prev: AutonomyWidgetState) => ({
      ...prev,
      expanded: !prev.expanded,
    }))
  }

  return (
    <div
      className={`autonomy-widget-base ${
        expanded && !isCompact ? 'h-[88px]' : 'h-[48px]'
      } ${isCompact && '!w-[88px]'} bg-gray-900 text-white`}>
      <div className="flex justify-between items-center w-full px-2 py-2 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Timer
            key="autonomy-timer"
            duration={time}
            state={isPaused ? 'paused' : 'running'}
            icon={TimerIconComponent}
            tooltip={timerTooltip}
          />
          {!isCompact && (
            <div className="min-w-0 flex-1">
              <StatusMessage message={currentActionName} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isCompact && showExpandCollapse && (
            <Button
              icon={expanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
              tooltip={expanded ? 'Collapse Controls' : 'View Controls'}
              variant="caret-borderless"
              ariaLabel={expanded ? 'Collapse' : 'Expand'}
              onClick={handleExpandToggle}
              size={32}
            />
          )}
          <Button
            icon={isPaused ? 'PlayIcon' : 'StopSignIcon'}
            variant={isPaused ? 'play-borderless' : 'stop-borderless'}
            tooltip={isPaused ? 'Resume Mission' : 'Pause Mission'}
            ariaLabel={isPaused ? 'Resume' : 'Pause'}
            onClick={handlePauseToggle}
            size={32}
          />
        </div>
      </div>
      {expanded && hasButtons && (
        <div className="px-2 pb-2 w-full">
          {/* Render action buttons directly for better control over dynamic UI */}
          <div className="flex flex-row gap-2 flex-wrap">
            {currentButtons.map((button) => {
              // Handle special component types
              if (button.component === 'orbit-slider') {
                return (
                  <OrbitSlider
                    key={button.id}
                    min={0}
                    max={100}
                    step={5}
                    progress={state.orbitProgress}
                    onChange={(value) => console.log('Orbit progress:', value)}
                  />
                )
              }

              // Regular button rendering
              return (
                <Button
                  key={button.id}
                  icon={button.icon as IconName} // Cast to IconName since button.icon comes from action configs
                  label={expanded ? button.label : undefined} // Show text labels in expanded mode
                  variant={button.variant as 'action'}
                  ariaLabel={button.ariaLabel || button.label}
                  tooltip={expanded ? undefined : button.tooltip} // Only show tooltip in compact mode
                  onClick={() => handleButtonClick(button)}
                  size={expanded ? 'auto' : 32} // Auto size for text labels
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
