import { stylesMap } from '../utils/stylesMap';
import { Plugin } from '../types';
import { cssLinearInterpolation } from '../utils/cssLinearInterpolation';

const MIN_MAX_PATTERN = /-?\d+/g;
const MIN_MAX_DEFAULT_VALUE = [0, 0];

export const pfs = (minDevice = 400, maxDevice = 1200): Plugin => {
  return ({ styles, addStyles }) => {
    addStyles(
      stylesMap(styles, (selector, css) => {
        const [property, value] = css;
        if (/pfs\(.*\)/g.test(value)) {
          const values = value.match(MIN_MAX_PATTERN)?.map(Number) ?? MIN_MAX_DEFAULT_VALUE;
          const [min, max] = [Math.min(...values), Math.max(...values)];
          const newValue = `clamp(${min}px, ${cssLinearInterpolation({
            [minDevice]: min,
            [maxDevice]: max,
          })}, ${max}px)`;
          return {
            [selector]: [property, newValue],
          };
        }
        return {
          [selector]: css,
        };
      }),
    );
  };
};
