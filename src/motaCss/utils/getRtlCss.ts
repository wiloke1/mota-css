import rtlCssJs from 'rtl-css-js';
import { Config, CssProps } from '../types';
import { getImportant } from './getImportant';
import { getValue } from './getValue';

const rtlTranslateCalc = (value: string) => {
  if (/translateX/g.test(value)) {
    return value
      .replace(/calc\(/, 'calc(-1 * (')
      .replace(/\)\s*}/g, ')) }')
      .replace(/\)\s*!important/g, ')) !important');
  }
  if (/translate\(/g.test(value)) {
    return value.replace(/calc\(/, 'calc(-1 * (').replace(/\),/g, ')),');
  }
  return value;
};

export const getRtlCss = (config: Config, cssProps: CssProps, className: string, style: string) => {
  let prop = className.replace(/\\?:.*/g, '');
  prop = cssProps[prop] ?? prop;
  const value = getValue(config, className.replace(/\\/g, ''));
  if (process.env.NODE_ENV === 'test') {
    return '';
  }
  const [newProp, newValue] = Object.entries(
    rtlCssJs({
      [prop]: value,
    }),
  )[0];
  const start = !!config.parentSelector ? `\n[dir="rtl"] ${config.parentSelector} ` : '\n[dir="rtl"] ';
  const important = getImportant(className);
  if (newProp !== prop) {
    return `${start}.${className} { ${newProp}: ${value}${important} }`;
  }
  if (newValue !== value) {
    return `${start}.${className} { ${prop}: ${newValue}${important} }`;
  }
  if (/translate(\(calc|X\(calc)/g.test(style)) {
    return `${start}.${className} ${rtlTranslateCalc(style)}`;
  }
  return '';
};
