import { MAX_RANGE, MIN_RANGE, SPACE } from 'motaCss/constants';
import { Config } from '../types';
import { cssLinearInterpolation } from './cssLinearInterpolation';

const CHAR_PATTERN = /(.*:)|((\||@|!).*)/g;
const UNDERCORE_PATTERN = /_/g;
const MIN_MAX_PATTERN = /-?\d+/g;
const MIN_MAX_DEFAULT_VALUE = [0, 0];

export const getValue = (config: Config, className: string) => {
  const value = className
    // Replace all special characters with their escaped version
    // Eg: zzz:xxx|cc -> xxx
    .replace(CHAR_PATTERN, '')
    // Replace all underscores with a space
    .replace(UNDERCORE_PATTERN, SPACE);

  return value
    .split(SPACE)
    .reduce((str, item) => {
      const newItem = config.custom[item]?.toString() || item;
      if (/pfs\(.*\)/g.test(newItem)) {
        const [min, max] = newItem.match(MIN_MAX_PATTERN)?.map(Number) ?? MIN_MAX_DEFAULT_VALUE;
        return `clamp(${min}px, ${cssLinearInterpolation({
          [MIN_RANGE]: min,
          [MAX_RANGE]: max,
        })}, ${max}px)`;
      }
      return `${str} ${newItem}`;
    }, '')
    .trim();
};
