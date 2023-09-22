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
          const [min, max] = value.match(MIN_MAX_PATTERN)?.map(Number) ?? MIN_MAX_DEFAULT_VALUE;
          let newValue = `clamp(${min}px, ${cssLinearInterpolation({
            [minDevice]: min,
            [maxDevice]: max,
          })}, ${max}px)`;
          if (min < 0 && max < 0) {
            newValue = `calc(clamp(${min * -1}px, ${cssLinearInterpolation({
              [minDevice]: min * -1,
              [maxDevice]: max * -1,
            })}, ${max * -1}px) * -1)`;
          }
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
