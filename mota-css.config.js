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
  custom: {
    'color-primary': 'var(--color-primary)',
    'color-secondary': 'var(--color-secondary)',
    'color-tertiary': 'var(--color-tertiary)',
    'color-quaternary': 'var(--color-quaternary)',
  },
};
