import type { FC, SVGProps } from 'react'

// Import each icon for the Icons object using SVGR React component syntax
import ArrowLeftIcon from './ArrowLeftIcon.svg?react'
import CameraIcon from './CameraIcon.svg?react'
import PlayIcon from './PlayIcon.svg?react'
import CaretIcon from './CaretIcon.svg?react'
import RouteIcon from './RouteIcon.svg?react'
import StopIcon from './StopIcon.svg?react'
import XIcon from './XIcon.svg?react'

// Export icons individually if you want
export {
  ArrowLeftIcon,
  CameraIcon,
  PlayIcon,
  CaretIcon,
  RouteIcon,
  StopIcon,
  XIcon,
}

// Export a single Icons object
export const Icons = {
  ArrowLeftIcon,
  CameraIcon,
  PlayIcon,
  CaretIcon,
  RouteIcon,
  StopIcon,
  XIcon,
} as const

export type IconName = keyof typeof Icons

export type IconComponentType = FC<SVGProps<SVGSVGElement>>
