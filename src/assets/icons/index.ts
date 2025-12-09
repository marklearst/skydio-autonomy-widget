import type { FC, SVGProps } from 'react'

// Import each icon as a React component using SVGR
import ArrowLeftIcon from './ArrowLeftIcon.svg?react'
import CameraIcon from './CameraIcon.svg?react'
import PlayIcon from './PlayIcon.svg?react'
import CaretIcon from './CaretIcon.svg?react'
import RouteIcon from './RouteIcon.svg?react'
import StopIcon from './StopIcon.svg?react'
import XIcon from './XIcon.svg?react'

export {
  ArrowLeftIcon,
  CameraIcon,
  PlayIcon,
  CaretIcon,
  RouteIcon,
  StopIcon,
  XIcon,
}

// Export a single Icons object with literal typing
export const Icons = {
  ArrowLeftIcon,
  CameraIcon,
  PlayIcon,
  CaretIcon,
  RouteIcon,
  StopIcon,
  XIcon,
} as const

// Derive IconName from Icons keys
export type IconName = keyof typeof Icons

// Define IconComponentType
export type IconComponentType = FC<SVGProps<SVGSVGElement>>
