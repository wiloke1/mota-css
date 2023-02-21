import { Plugin } from '../types';
import { stylesMap } from '../utils/stylesMap';

export const pixelToRem = (rootFontSize: number): Plugin => {
  return ({ styles, addStyles }) => {
    addStyles(
      stylesMap(styles, (selector, css) => {
        const [property, value] = css;
        if (/[\d.]*px/g.test(value)) {
          const newValue = value.replace(/[\d.]*px/g, val => {
            const num = Number(val.replace('px', ''));
            return `${(num * 62.5) / rootFontSize / 10}rem`;
          });
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
