export interface IMotaCss {
  find(html: string): void;
  setConfig(config: Config): void;
  getCss(): string;
  customValue(callback: CustomValue): void;
  setClassNames(classNames: string[]): void;
  addPropsSyntax(props: CssProps): void;
  addPseudoSyntax(pseudo: Pseudo): void;
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
