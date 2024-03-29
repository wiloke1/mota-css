import { Id } from './utils/event';

export interface IMotaCss {
  /**
   * Find the class names in the string
   * @example
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * atomic
   *   .find(`<div class="c:red c:blue|h fz:20px w:30%@md p:30px@md m:20px@+300px pos:relative!"></div>`);
   *   .find(`const className = "bgc:blue";`);
   * ```
   */
  find(value: string): void;
  /**
   * Set the config
   */
  setConfig(config: ClientConfig): void;
  /**
   * Get the css
   * @example
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * const cssContent = atomic.getCss();
   * ```
   */
  getCss(): string;
  /**
   * Custom css values
   * @example
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * atomic.customValue(value => {
   *   console.log(value);
   *   return value;
   * });
   * ```
   */
  customValue(callback: CustomValue): void;
  /**
   * Get the class names
   */
  getClassNames(): string[];
  /**
   * Reset the class names, styles and cache
   */
  reset(): IMotaCss;
  /**
   * Set the class names
   * @example
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * atomic.setClassNames(['c:red', 'bgc:blue']);
   * ```
   */
  setClassNames(classNames: string[]): void;
  /**
   * Add syntax for properties
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * atomic.addPropsSyntax({
   *   co: 'color',
   *   test: 'background-color',
   * });
   * ```
   */
  addPropsSyntax(props: CssProps): void;
  /**
   * Add syntax for pseudo
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * atomic.addPseudoSyntax({
   *   ho: 'hover',
   *   abc: 'focus',
   * });
   * ```
   */
  addPseudoSyntax(pseudo: Pseudo): void;
  /**
   * On success and failure
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * atomic.on('success', css => {
   *   console.log(css);
   * });
   *
   * atomic.on('valid', diagnostic => {
   *   console.log(diagnostic);
   * });
   *
   * atomic.on('invalid', diagnostic => {
   *   console.log(diagnostic);
   * });
   * ```
   */
  on<K extends keyof Event = keyof Event>(eventType: K, listener: Event[K]): Id;
  /**
   * Off event success and failure
   */
  off(id: Id): void;
  /**
   * Add plugins
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * atomic.addPlugins([rtl(), pfs()]);
   * ```
   */
  plugins(plugins: Plugin[]): void;
  /**
   * Create a new instance
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * const instance = atomic.create();
   * ```
   */
  create(): IMotaCss;
}
export interface ClientConfig {
  /**
   * Breakpoints for media queries
   * @example
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * atomic.setConfig({
   *   breakpoints: {
   *     sm: '768px',
   *     md: '992px',
   *     lg: '1200px',
   *   },
   *   ...
   * });
   * ```
   */
  breakpoints: BreakPoints;
  /**
   * Custom css values with object
   * @example
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * atomic.setConfig({
   *   custom: {
   *     'color-primary': 'var(--color-primary)',
   *     'color-secondary': 'var(--color-secondary)'
   *   },
   *   ...
   * });
   * ```
   */
  custom: Custom;
  /**
   * Cache enabled
   */
  cache: boolean;
  /**
   * Parent selector
   * @example
   * ```
   * import { atomic } from 'mota-css';
   *
   * atomic.setConfig({
   *   parentSelector: '.root',
   * });
   *
   * atomic.find(`<div class="c:red"></div>`);
   * console.log(atomic.getCss());
   * // Css result: .root .c\:red { color: red }
   * ```
   */
  parentSelector: string;
  /**
   * Default css
   * @example
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * atomic.setConfig({
   *   defaultCss: `
   *     body {
   *       font-size: 14px;
   *     }
   *   `,
   *   ...
   * });
   * ```
   */
  defaultCss: string;
  /**
   * Exclude class names
   */
  exclude: string[];
  /**
   * Default class names
   */
  defaultClassNames: string[];
  /**
   * Validate css
   */
  validator?: (css: string) => any;
}

export type Style = [string, string];
export interface SelectorStyle {
  [selector: string]: Style;
}
export interface Styles {
  [breakpoint: string]: SelectorStyle;
}
export type BreakPoints = Record<string, string>;
export type Custom = Record<string, string | number>;
export interface PluginOptions {
  config: ClientConfig;
  cssProps: CssProps;
  pseudo: Pseudo;
  styles: Styles;
  input: string;
  prevInput: string;
  addStyles(styles: Styles): void;
  addBase(css: string): void;
  addComponent(css: string): void;
}
export type Plugin = (styles: PluginOptions) => void;
export interface Diagnostic {
  message: string;
  className: string;
}
export interface Event {
  success: (css: string) => void;
  valid: (diagnostic: Diagnostic) => void;
  invalid: (diagnostic: Diagnostic) => void;
}
export type Listener = (css: string) => void;
export type ErrorListener = (error: Error | null) => void;
export type Unsubscribe = () => void;
export type CustomValue = (value: string) => string;
export type CssProps = Record<string, string>;
export type Pseudo = Record<string, string>;

export interface Config extends ClientConfig {
  input: string;
  output: string;
  customValue: CustomValue;
  plugins: Plugin[];
}
