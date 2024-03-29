import rtlCssJs from 'rtl-css-js';
import { stylesMap } from '../utils/stylesMap';
import { selectorTransformer } from '../utils/selectorTransformer';
import { Plugin } from '../types';

const rtlTranslateCalc = (value: string) => {
  if (/translateX/g.test(value)) {
    return value
      .replace(/calc\(/, 'calc(-1 * (')
      .replace(/\)$/g, '))')
      .replace(/\)\s*!important/g, ')) !important');
  }
  if (/translate\(/g.test(value)) {
    return value.replace(/calc\(/, 'calc(-1 * (').replace(/\),/g, ')),');
  }
  return value;
};

const resetValue = () => {
  return 'initial';
};

export const rtl = (): Plugin => {
  return ({ styles, addStyles, addBase }) => {
    addStyles(
      stylesMap(styles, (selector, css) => {
        const [property, value] = css;
        if (process.env.NODE_ENV === 'test') {
          return {
            [selector]: css,
          };
        }
        const [newProp, newValue] = Object.entries(
          rtlCssJs({
            [property]: value,
          }),
        )[0];
        const start = selector.includes('[dir=rtl] ') ? '' : '[dir=rtl] ';
        if (newProp !== property) {
          addBase(`${selectorTransformer(`${start}${selector}`)} { ${property}: ${resetValue()} }`);
          return {
            [selector]: css,
            [`${start}${selector}`]: [newProp, value],
          };
        }
        if (newValue !== value) {
          return {
            [selector]: css,
            [`${start}${selector}`]: [property, newValue],
          };
        }
        if (/translate(\(calc|X\(calc)/g.test(value)) {
          return {
            [selector]: css,
            [`${start}${selector}`]: [property, rtlTranslateCalc(value)],
          };
        }
        return {
          [selector]: css,
        };
      }),
    );
  };
};
