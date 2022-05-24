import { Config, CssProps, Style } from '../types';
import { getRtlCss } from './getRtlCss';

export const getCssOnce = (config: Config, cssProps: CssProps, styles: Style) => {
  return Object.entries(styles).reduce<string>((css, [className, style]) => {
    const start = !!config.parentSelector ? `${css}\n${config.parentSelector} ` : `${css}\n`;
    if (config.useRtl) {
      return `${start}.${className} ${style}${getRtlCss(config, cssProps, className, style)}`;
    }
    return `${start}.${className} ${style}`;
  }, '');
};
