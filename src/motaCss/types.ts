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
  setConfig(config: Config): void;
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
   * Subscribe to the css
   * ```ts
   * import { atomic } from 'mota-css';
   *
   * const unsubscribe = atomic.subscribe((css) => {
   *   console.log(css);
   *   // or console.log(atomic.getCss());
   * });
   * ```
   */
  subscribe(listener: Listener): Unsubscribe;
}

export type Style = Record<string, string>;
export interface Styles {
  [breakpoint: string]: Style;
}
export type BreakPoints = Record<string, string>;
export type Custom = Record<string, string | number>;
export interface Config {
  breakpoints: BreakPoints;
  custom: Custom;
  cache: boolean;
  parentSelector: string;
  defaultCss: string;
  useRtl: boolean;
  uniqueClassNameForCssMethod: boolean;
  exclude: string[];
  defaultClassNames: string[];
}
export type Listener = (css: string) => void;
export type Unsubscribe = () => void;
export type CustomValue = (value: string) => string;
export type CssProps = Record<string, string>;
export type Pseudo = Record<string, string>;
