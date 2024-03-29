import { MEDIA_DEFAULT, MEDIA_MAX_WIDTH, MEDIA_MIN_WIDTH } from '../constants';
import { Config } from '../types';

export const getBreakpoint = (config: Config, selector: string) => {
  const hasBreakpoint = selector.includes(MEDIA_MIN_WIDTH);

  if (hasBreakpoint) {
    const isMax = selector.includes(MEDIA_MAX_WIDTH);
    let breakpoint = selector.replace(/.*@\+?|!/g, '');
    const breakpointFromConfig = config.breakpoints[breakpoint];
    breakpoint = breakpointFromConfig || breakpoint;
    const num = Number(breakpoint.replace(/\D/g, '') ?? '0');
    const unit = breakpoint.replace(/.*\d+/g, '');
    if (isMax) {
      return `${num - (!!breakpointFromConfig ? 1 : 0)}${unit}`;
    }
    return breakpoint;
  }

  return MEDIA_DEFAULT;
};
