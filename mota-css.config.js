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

function test2() {
  return ({ addBase }) => {
    addBase(`.testttttttttt { color: red }`);
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
  plugins: [rtl(), pfs(), groupHover(), testplugin(), test2()],
  custom: {
    'color-primary': 'var(--color-primary)',
    'color-secondary': 'var(--color-secondary)',
    'color-tertiary': 'var(--color-tertiary)',
    'color-quaternary': 'var(--color-quaternary)',
  },
};
