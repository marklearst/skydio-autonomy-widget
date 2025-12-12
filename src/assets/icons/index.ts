import type { FC, SVGProps } from 'react'

// Import Figma icons as React components using SVGR
import ChevronLeftIcon from './c_chevron-left.svg?react'
import ChevronRightIcon from './c_chevron-right.svg?react'
import ChevronDownIcon from './c_chevron-down.svg?react'
import ChevronUpIcon from './c_chevron-up.svg?react'
import ChevronsLeftIcon from './c_chevrons-left.svg?react'
import ChevronsRightIcon from './c_chevrons-right.svg?react'
import ArrowTurnDownLeftIcon from './c_arrow-turn-down-left.svg?react'
import CameraViewfinderIcon from './c_camera-viewfinder.svg?react'
import BinocularsIcon from './c_binoculars.svg?react'
import ArrowDownToLineIcon from './c_arrow-down-to-line.svg?react'
import PlayIcon from './c_play.svg?react'
import StopSignIcon from './m_stop_sign.svg?react'
import ArrowLeftIcon from './icon.arrow.left.svg?react'
import OrbitIcon from './icon.orbit.iso.svg?react'
import RouteIcon from './c_route.svg?react'
import XSquareIcon from './x_square.svg?react'

export {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowTurnDownLeftIcon,
  CameraViewfinderIcon,
  BinocularsIcon,
  ArrowDownToLineIcon,
  PlayIcon,
  StopSignIcon,
  OrbitIcon,
  RouteIcon,
  ArrowLeftIcon,
  XSquareIcon,
}

// Export a single Icons object with literal typing
export const Icons = {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowTurnDownLeftIcon,
  CameraViewfinderIcon,
  BinocularsIcon,
  ArrowDownToLineIcon,
  PlayIcon,
  StopSignIcon,
  OrbitIcon,
  RouteIcon,
  ArrowLeftIcon,
  XSquareIcon,
}

// Derive IconName from Icons keys
export type IconName = keyof typeof Icons

// Define IconComponentType
export type IconComponentType = FC<SVGProps<SVGSVGElement>>
