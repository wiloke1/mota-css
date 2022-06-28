import { Plugin } from 'motaCss/types';

export const groupHover = (): Plugin => {
  const className = 'group-hover';
  return ({ styles, config, addStyles }) => {
    addStyles(
      Object.entries(styles).reduce((obj, [breakpoint, style]) => {
        return {
          ...obj,
          [breakpoint]: Object.entries(style).reduce((obj, [selector, css]) => {
            const [property, value] = css;
            const regexp = new RegExp(`\\*${className}`, 'g');
            if (regexp.test(selector)) {
              const newSelector = `${config.parentSelector} .group\\*:hover ${selector
                .replace(regexp, `\\*${className}`)
                .replace(config.parentSelector, '')}`;
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
