import { Style, Styles } from 'motaCss/types';

export type Callback = (selector: string, css: Style) => Record<string, Style>;

export const stylesMap = (styles: Styles, callback: Callback) => {
  return Object.entries(styles).reduce<Styles>((obj, [breakpoint, style]) => {
    return {
      ...obj,
      [breakpoint]: Object.entries(style).reduce((obj, [selector, css]) => {
        return {
          ...obj,
          ...callback(selector, css),
        };
      }, {}),
    };
  }, {});
};
