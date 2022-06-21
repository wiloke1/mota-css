import { SelectorStyle } from '../types';
import { getStyle } from './getStyle';
import { selectorTransformer } from './selectorTransformer';

export const styleToCssString = (styles: SelectorStyle) => {
  return Object.entries(styles).reduce((css, [selector, style]) => {
    if (!Array.isArray(style)) {
      return css;
    }
    const strStyle = getStyle(...style);
    const selector_ = selectorTransformer(selector).replace(/\s+/g, ' ');
    return `${css}\n${selector_} ${strStyle}`;
  }, '');
};
