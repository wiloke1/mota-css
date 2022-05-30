import { COMPILED_SUCCESS, DOT, MAX_CACHE_SIZE, MEDIA_DEFAULT, MEDIA_MAX_WIDTH } from './constants';
import { Config, CssProps, CustomValue, Event, IMotaCss, Plugin, Pseudo, Styles } from './types';
import { selectorTransformer } from './utils/selectorTransformer';
import { cssValidator } from './utils/cssValidator';
import { props, pseudo } from './utils/data';
import { event, Id } from './utils/event';
import { getBreakpoint } from './utils/getBreakpoint';
import { getClassNames } from './utils/getClassNames';
import { getImportant } from './utils/getImportant';
import { getPseudo } from './utils/getPseudo';
import { getStyle, handleValueHasContent } from './utils/getStyle';
import { getValue } from './utils/getValue';
import { removeDuplicate } from './utils/removeDuplicate';
import { removeNextLineWithIgnore } from './utils/removeNextLineWithIgnore';
import { styleToCssString } from './utils/styleToCssString';

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

  private handlePluginAddStyles(styles: Styles) {
    this.styles = {
      ...this.styles,
      ...styles,
    };
  }

  private handlePluginAddBase(css: string) {
    if (!this.config.defaultCss.includes(css)) {
      this.config.defaultCss = `${this.config.defaultCss}\n${css}`;
    }
  }

  public plugins(plugins: Plugin[]): void {
    event.on('plugin', () => {
      if (plugins.length) {
        plugins.forEach(plugin => {
          plugin({
            config: this.config,
            cssProps: this.cssProps,
            pseudo: this.pseudo,
            styles: this.styles,
            addStyles: this.handlePluginAddStyles.bind(this),
            addBase: this.handlePluginAddBase.bind(this),
          });
        });
      }
    });
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

  private _isMediaMaxWidth(selector: string) {
    return selector.replace(/\\/g, '').includes(MEDIA_MAX_WIDTH);
  }

  private _checkValidate(className: string, selector: string, style: string) {
    const breakpoint = getBreakpoint(this.config, selector);
    const newBreakpoint = this.config.breakpoints[breakpoint] || breakpoint;
    const isMax = this._isMediaMaxWidth(selector);
    const selector_ = selectorTransformer(selector);
    let css = `${selector_} ${style}`;
    if (newBreakpoint !== MEDIA_DEFAULT) {
      css = `@media (${isMax ? 'max' : 'min'}-width:${newBreakpoint}) { ${selector_} ${style} }`;
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
      const property = this.cssProps[propShorthand];
      const breakpoint = getBreakpoint(this.config, className);
      const important = getImportant(className);
      const value = `${this._customValue(getValue(this.config, className))}${important}`;
      const parentSelector = !!this.config.parentSelector ? `${this.config.parentSelector} ` : '';

      if (!property || !className.includes(':') || !value) {
        return styles;
      }

      const selector = `${parentSelector}${DOT}${!!className.includes('|') ? `${className}${getPseudo(className)}` : className}`;
      const style = getStyle(property, value);

      if (this._checkValidate(className, selector, style)) {
        return styles;
      }

      return {
        ...styles,
        [breakpoint]: {
          ...styles[breakpoint],
          [selector]: [property, handleValueHasContent(value)],
        },
      };
    }, {} as Styles);

    event.emit('plugin', undefined);
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

  public setConfig(cfg: Partial<Config> = {}) {
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
      const cssString = styleToCssString(style);
      if (newBreakpoint === MEDIA_DEFAULT) {
        return `${css}\n${cssString}`;
      }
      return `${css}\n@media (${isMax ? 'max' : 'min'}-width:${newBreakpoint}) { ${cssString} }`;
    }, '');
    const allCss = `${this.config.defaultCss}\n${css}`.replace(/\n+/g, '\n');

    return allCss;
  }

  public getClassNames() {
    return this.classNames;
  }

  public reset() {
    this.classNames = [];
    this.styles = {};
    this.cache = [];
    this.valid = new Set();
    return this;
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

  public create() {
    return new MotaCss();
  }
}

export const atomic = new MotaCss();
