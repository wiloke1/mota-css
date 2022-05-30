import { Plugin } from 'motaCss/types';

export const groupHover = (): Plugin => {
  const className = 'group-hover';
  return ({ styles, addStyles }) => {
    addStyles(
      Object.entries(styles).reduce((obj, [breakpoint, style]) => {
        return {
          ...obj,
          [breakpoint]: Object.entries(style).reduce((obj, [selector, css]) => {
            const [property, value] = css;
            const regexp = new RegExp(`\\*${className}`, 'g');
            if (regexp.test(selector)) {
              const newSelector = `.group\\*:hover ${selector.replace(regexp, `\\*${className}`)}`;
              const newValue = value.replace(regexp, '');
              return {
                ...obj,
                [newSelector]: [property, newValue],
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
