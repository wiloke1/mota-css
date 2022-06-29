import { Plugin } from 'motaCss/types';
import { stylesMap } from '../utils/stylesMap';

export const groupHover = (): Plugin => {
  const className = 'group-hover';
  return ({ styles, config, addStyles }) => {
    addStyles(
      stylesMap(styles, (selector, css) => {
        const [property, value] = css;
        const regexp = new RegExp(`\\*${className}`, 'g');
        if (regexp.test(selector)) {
          const parentSelector = !!config.parentSelector ? `${config.parentSelector} ` : '';
          const newSelector = `${parentSelector}.group\\*:hover ${selector.replace(regexp, `\\*${className}`).replace(config.parentSelector, '')}`;
          const newValue = value.replace(regexp, '');
          return {
            [newSelector]: [property, newValue],
          };
        }
        return { [selector]: css };
      }),
    );
  };
};
