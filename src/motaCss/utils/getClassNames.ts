import { Config, CssProps } from '../types';
import { removeDuplicate } from './removeDuplicate';

const removeRedundantChar = (value: string) => {
  return value.replace(/^("|'|`|\s)/g, '');
};

const cond = (item: string) => {
  const item_ = removeRedundantChar(item);
  return item_.match(/\(|\)/g)?.length != null && (item_.match(/\(|\)/g)?.length ?? 0) % 2 !== 0;
};

export const getClassNames = (value: string, config: Config, cssProps: CssProps) => {
  const classNames = Object.keys(cssProps).reduce<string[]>((arr, key) => {
    const regexp = new RegExp(`("|'|\`|\\s)${key}:(\\w|\\/|\\||\\.|\\+|\\*|\\(|\\)|\\!|%|@|#|,|;|-)*`, 'g');
    return [
      ...arr,
      ...((value.match(regexp) || []) as string[]).reduce<string[]>((arr, item) => {
        // Condition item has `(` but not `)`
        if (cond(item)) {
          return arr;
        }
        if (item.includes('t:sections')) {
          return arr;
        }
        const newItem = removeRedundantChar(item);
        if (config.exclude.includes(newItem) || !/:./g.test(newItem)) {
          return arr;
        }
        return [...arr, newItem];
      }, []),
    ];
  }, []);

  return removeDuplicate([...classNames, ...config.defaultClassNames]);
};
