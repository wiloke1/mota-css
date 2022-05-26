import { Plugin } from '../types';
import { cssLinearInterpolation } from '../utils/cssLinearInterpolation';

const MIN_MAX_PATTERN = /-?\d+/g;
const MIN_MAX_DEFAULT_VALUE = [0, 0];

export const pfs = (minDevice = 400, maxDevice = 1200): Plugin => {
  return ({ styles, addStyles }) => {
    addStyles(
      Object.entries(styles).reduce((obj, [breakpoint, style]) => {
        return {
          ...obj,
          [breakpoint]: Object.entries(style).reduce((obj, [selector, css]) => {
            const [property, value] = css;
            if (/pfs\(.*\)/g.test(value)) {
              const [min, max] = value.match(MIN_MAX_PATTERN)?.map(Number) ?? MIN_MAX_DEFAULT_VALUE;
              const newValue = `clamp(${min}px, ${cssLinearInterpolation({
                [minDevice]: min,
                [maxDevice]: max,
              })}, ${max}px)`;
              return {
                ...obj,
                [selector]: [property, newValue],
              };
            }
            return {
              ...obj,
              [selector]: css,
            };
          }, {}),
        };
      }, {}),
    );
  };
};
