import { Plugin } from 'motaCss/types';

export const pixelToRem = (rootFontSize: number): Plugin => {
  return ({ styles, addStyles }) => {
    addStyles(
      Object.entries(styles).reduce((obj, [breakpoint, style]) => {
        return {
          ...obj,
          [breakpoint]: Object.entries(style).reduce((obj, [selector, css]) => {
            const [property, value] = css;
            if (/[\d.]*px/g.test(value)) {
              const newValue = value.replace(/[\d.]*px/g, val => {
                const num = Number(val.replace('px', ''));
                return `${(num * 62.5) / rootFontSize / 10}rem`;
              });
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
