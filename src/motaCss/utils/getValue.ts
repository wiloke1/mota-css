import { SPACE } from '../constants';
import { Config } from '../types';

const CHAR_PATTERN = /(.*:)|((\||@|!).*)/g;
const UNDERCORE_PATTERN = /_/g;

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
      return `${str} ${newItem}`;
    }, '')
    .trim();
};
