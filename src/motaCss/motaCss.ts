import { cssValidator } from './utils/cssValidator';
import { props, pseudo } from './utils/data';
import { getBreakpoint } from './utils/getBreakpoint';
import { classNameTransformer } from './utils/classNameTransformer';
import { getClassNames } from './utils/getClassNames';
import { getCssOnce } from './utils/getCssOnce';
import { getImportant } from './utils/getImportant';
import { getPseudo } from './utils/getPseudo';
import { getStyle } from './utils/getStyle';
import { getValue } from './utils/getValue';
import { removeDuplicate } from './utils/removeDuplicate';
import { removeNextLineWithIgnore } from './utils/removeNextLineWithIgnore';
import { Config, CssProps, CustomValue, IMotaCss, Listener, Pseudo, Styles, Unsubscribe } from './types';
import { MAX_CACHE_SIZE, MEDIA_DEFAULT, MEDIA_MAX_WIDTH } from './constants';

export class MotaCss implements IMotaCss {
  private classNames: string[];
  private styles: Styles;
  private defaultConfig: Config;
  private config: Config;
  private listeners: Listener[];
  private cache: string[];
  private _customValue: CustomValue;
  private cssProps: CssProps;
  private pseudo: Pseudo;
  private warn: boolean;
  private valid: Set<string>;

  constructor() {
    this.defaultConfig = {
      breakpoints: {
        sm: '768px',
        md: '992px',
        lg: '1200px',
      },
      custom: {},
      cache: false,
      parentSelector: '',
      defaultCss: '',
      useRtl: false,
      uniqueClassNameForCssMethod: false,
      exclude: [],
      defaultClassNames: [],
    };
    this.classNames = [];
    this.styles = {};
    this.config = this.defaultConfig;
    this.listeners = [];
    this.cache = [];
    this._customValue = (value: string) => value;
    this.cssProps = props;
    this.pseudo = pseudo;
    this.warn = false;
    this.valid = new Set();
  }

  private _setClassNames(value: string) {
    const newValue = removeNextLineWithIgnore(value);
    const newClassNames = getClassNames(newValue, this.config, this.cssProps);
    this.classNames = removeDuplicate([...this.classNames, ...newClassNames]);
  }

  private _isMediaMaxWidth(className: string) {
    return className.replace(/\\/g, '').includes(MEDIA_MAX_WIDTH);
  }

  private _checkWarn(className: string, style: string) {
    const breakpoint = getBreakpoint(this.config, className);
    const newBreakpoint = this.config.breakpoints[breakpoint] || breakpoint;
    let css = `.selector ${style}`;
    if (newBreakpoint !== MEDIA_DEFAULT) {
      // No need to check if it's max-width
      css = `@media (min-width:${newBreakpoint}) { .selector ${style} }`;
    }
    if (this.valid.has(css)) {
      return false;
    }

    const diagnostics = cssValidator(css);
    if (diagnostics.length) {
      const warn = `⚠️  ${diagnostics[0].message} in { class: '${className}', css: '${style}' }`;
      console.log(`\n\x1b[31m${warn}\x1b[0m`);
      this.classNames = this.classNames.filter(name => name !== className);
      this.warn = true;
      return true;
    }
    this.valid.add(css);
    return false;
  }

  private _success(index: number) {
    if (this.warn && index === this.classNames.length - 1) {
      const success = `✅ Compiled successfully`;
      console.log(`\n\x1b[32m${success}\x1b[0m`);
      this.warn = false;
    }
  }

  private _setStyles() {
    this.styles = this.classNames.reduce<Styles>((styles, className, index) => {
      const propShorthand = className.replace(/:.*/g, '');
      const prop = props[propShorthand] || propShorthand;
      const className_ = classNameTransformer(className);
      const value = this._customValue(getValue(this.config, className));

      if (!prop || !className.includes(':') || !value) {
        return styles;
      }

      const important = getImportant(className);
      const style = getStyle(prop, value, important);
      const breakpoint = getBreakpoint(this.config, className);

      if (this._checkWarn(className, style)) {
        return styles;
      }

      this._success(index);

      if (!!className.includes('|')) {
        const pseudo = getPseudo(className);
        return {
          ...styles,
          [breakpoint]: {
            ...styles[breakpoint],
            [`${className_}${pseudo}`]: style,
          },
        };
      }

      return {
        ...styles,
        [breakpoint]: {
          ...styles[breakpoint],
          [className_]: style,
        },
      };
    }, {} as Styles);
  }

  private _setCache(value: string) {
    this.cache.push(value);
    const len = this.cache.length;
    if (len > MAX_CACHE_SIZE) {
      this.cache = this.cache.slice(len - MAX_CACHE_SIZE, len);
    }
  }

  public find(value: string) {
    if (this.config.cache) {
      if (!this.cache.includes(value)) {
        this._setClassNames(value);
        this._setStyles();
        this._setCache(value);
      }
    } else {
      this._setClassNames(value);
      this._setStyles();
    }
    this.listeners.forEach(listener => {
      listener(this.getCss());
    });
    return this;
  }

  public setConfig(cfg: Partial<Config>) {
    this.config = {
      ...this.defaultConfig,
      ...cfg,
    };
    return this;
  }

  public setClassNames(classNames: string[]) {
    this.classNames = {
      ...this.classNames,
      ...classNames,
    };
    this.listeners.forEach(listener => {
      listener(this.getCss());
    });
    return this;
  }

  public getCss() {
    const css = Object.entries(this.styles).reduce((css, [breakpoint, style]) => {
      const newBreakpoint = this.config.breakpoints[breakpoint] || breakpoint;
      const [className] = Object.keys(style);
      const isMax = this._isMediaMaxWidth(className);
      if (newBreakpoint === MEDIA_DEFAULT) {
        return `${css}\n${getCssOnce(this.config, this.cssProps, style)}`;
      }
      return `${css}\n@media (${isMax ? 'max' : 'min'}-width:${newBreakpoint}) { ${getCssOnce(this.config, this.cssProps, style)} }`;
    }, '');
    const allCss = `${this.config.defaultCss}\n${css}`.replace(/\n+/g, '\n');

    return allCss;
  }

  public customValue(callback: CustomValue) {
    this._customValue = callback;
  }

  public addPropsSyntax(props: CssProps) {
    this.cssProps = {
      ...this.cssProps,
      ...props,
    };
  }

  public addPseudoSyntax(pseudo: Pseudo) {
    this.pseudo = {
      ...this.pseudo,
      ...pseudo,
    };
  }

  public subscribe(listener: Listener): Unsubscribe {
    this.listeners.push(listener);
    const unsubscribe = () => {
      this.listeners = this.listeners.filter(listen => listen !== listener);
    };
    return unsubscribe;
  }
}

export const atomic = new MotaCss();
