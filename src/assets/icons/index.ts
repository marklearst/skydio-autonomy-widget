import type { FC, SVGProps } from 'react';

export { ReactComponent as ArrowTurnDownLeft } from './ArrowTurnDownLeft.svg';
export { ReactComponent as CameraViewfinder } from './CameraViewfinder.svg';
export { ReactComponent as Play } from './Play.svg';
export { ReactComponent as Caret } from './Caret.svg';
export { ReactComponent as Route } from './Route.svg';
export { ReactComponent as StopSign } from './StopSign.svg';
export { ReactComponent as XmarkLarge } from './XmarkLarge.svg';

export type IconComponentType = FC<SVGProps<SVGSVGElement>>;

export type IconName = keyof typeof import('./index');