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
import { Config, CssProps, CustomValue, Event, IMotaCss, Pseudo, Styles } from './types';
import { COMPILED_SUCCESS, MAX_CACHE_SIZE, MEDIA_DEFAULT, MEDIA_MAX_WIDTH } from './constants';
import { event, Id } from './utils/event';

export class MotaCss implements IMotaCss {
  private classNames: string[];
  private styles: Styles;
  private defaultConfig: Config;
  private config: Config;
  private cache: string[];
  private _customValue: CustomValue;
  private cssProps: CssProps;
  private pseudo: Pseudo;
  private valid: Set<string>;

  constructor() {
    this.defaultConfig = {
      breakpoints: {
        sm: '768px',
        md: '992px',
        lg: '1200px',
      },
      custom: {},
      cache: true,
      parentSelector: '',
      defaultCss: '',
      useRtl: false,
      exclude: [],
      defaultClassNames: [],
    };
    this.classNames = [];
    this.styles = {};
    this.config = this.defaultConfig;
    this.cache = [];
    this._customValue = (value: string) => value;
    this.cssProps = props;
    this.pseudo = pseudo;
    this.valid = new Set();
  }

  public on<K extends keyof Event = keyof Event>(eventType: K, listener: Event[K]): Id {
    return event.on(eventType, listener);
  }

  public off(id: Id): void {
    event.off(id);
  }

  private _setClassNames(value: string) {
    const newValue = removeNextLineWithIgnore(value);
    const newClassNames = getClassNames(newValue, this.config, this.cssProps);
    this.classNames = removeDuplicate([...this.classNames, ...newClassNames]);
  }

  private _isMediaMaxWidth(className: string) {
    return className.replace(/\\/g, '').includes(MEDIA_MAX_WIDTH);
  }

  private _checkValidate(className: string, style: string) {
    const breakpoint = getBreakpoint(this.config, className);
    const newBreakpoint = this.config.breakpoints[breakpoint] || breakpoint;
    const isMax = this._isMediaMaxWidth(className);
    const className_ = classNameTransformer(className);
    let css = `.${className_} ${style}`;
    if (newBreakpoint !== MEDIA_DEFAULT) {
      css = `@media (${isMax ? 'max' : 'min'}-width:${newBreakpoint}) { .${className_} ${style} }`;
    }

    if (this.valid.has(css)) {
      return false;
    }

    const diagnostics = cssValidator(css);
    if (diagnostics.length) {
      event.emit('invalid', {
        message: diagnostics[0].message,
        className,
        css,
      });
      this.classNames = this.classNames.filter(name => name !== className);
      return true;
    }
    event.emit('valid', {
      message: COMPILED_SUCCESS,
      className,
      css,
    });
    this.valid.add(css);
    return false;
  }

  private _setStyles() {
    this.styles = this.classNames.reduce<Styles>((styles, className) => {
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

      if (this._checkValidate(className, style)) {
        return styles;
      }

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
    event.emit('success', this.getCss());
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
    event.emit('success', this.getCss());
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
}

export const atomic = new MotaCss();
