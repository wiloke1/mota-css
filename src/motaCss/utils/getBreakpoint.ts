import { Config } from '../types';

const DEFAULT = 'default';
const MIN_WIDTH = '@';
const MAX_WIDTH = '@+';

export const getBreakpoint = (config: Config, className: string) => {
  const hasBreakpoint = className.includes(MIN_WIDTH);

  if (hasBreakpoint) {
    const isMax = className.includes(MAX_WIDTH);
    let breakpoint = className.replace(/.*@\+?|!/g, '');
    const breakpointFromConfig = config.breakpoints[breakpoint];
    breakpoint = breakpointFromConfig || breakpoint;
    const num = Number(breakpoint.replace(/\D/g, '') ?? '0');
    const unit = breakpoint.replace(/.*\d+/g, '');
    if (isMax) {
      return `${num - (!!breakpointFromConfig ? 1 : 0)}${unit}`;
    }
    return breakpoint;
  }

  return DEFAULT;
};
