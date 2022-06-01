const { pfs, rtl, groupHover, getStyle } = require('./dist/index');

function testplugin() {
  return ({ styles, addStyles }) => {
    addStyles(
      Object.entries(styles).reduce((obj, [breakpoint, style]) => {
        return {
          ...obj,
          [breakpoint]: Object.entries(style).reduce((obj, [selector, css]) => {
            const [property, value] = css;
            if (value === 'abc') {
              return {
                ...obj,
                [selector]: [property, 'pink'],
              };
            }
            return {
              ...obj,
              [selector]: css,
            };
          }, {}),
        };
      }, {}),
    );
  };
}

function log(arr) {
  return console.log(...arr.map(([text, color]) => `\x1b[${color}m${text}\x1b[0m`));
}

function numberOfLines() {
  return ({ input, prevInput, addComponent }) => {
    addComponent(`[class*="number-of-lines"] {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}`);

    const classNames = input.match(/number-of-lines-\d*/g);
    if (classNames) {
      classNames.forEach(className => {
        const lineClamp = Number(className.replace(/number-of-lines-/g, ''));
        addComponent(`.${className} { -webkit-line-clamp: ${lineClamp} }`);
        if (prevInput && !prevInput.includes(className)) {
          log([
            [`[Compiled successfully]`, 32],
            [`(class: ${className})`, 35],
          ]);
        }
      });
    }
  };
}

module.exports = {
  input: ['./example/**/*.html', './example/**/*.js'],
  output: './example/atomic.css',
  defaultCss: '',
  useRtl: true,
  breakpoints: {
    sm: '768px',
    md: '992px',
    lg: '1200px',
  },
  plugins: [rtl(), pfs(), groupHover(), testplugin(), numberOfLines()],
  custom: {
    'color-primary': 'var(--color-primary)',
    'color-secondary': 'var(--color-secondary)',
    'color-tertiary': 'var(--color-tertiary)',
    'color-quaternary': 'var(--color-quaternary)',
  },
};
