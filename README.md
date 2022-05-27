# MOTA CSS

### Auto generate css atomic

[![npm version](https://img.shields.io/npm/v/mota-css.svg)](https://www.npmjs.com/package/mota-css)

### Install

```bash
npm install mota-css
```

or

```bash
yarn add mota-css
```

### Demo

<https://mota-css-example.netlify.app/>

### Repo

<https://github.com/wiloke1/mota-css-example>

### mota-css.config.js

```js
const { pfs, rtl } = require('mota-css');

module.exports = {
  input: ["./src/**/*.jsx", "./src/**/*.js"],
  output: "./src/mota-css.css",
  defaultCss: `
    body {
      font-size: 14px;
    }
  `,
  cache: true,
  plugins: [pixelToRem(62.5), rtl(), pfs(), testplugin2()],
  customValue(value) {
    // customValue
    console.log(value);
    return value;
  },
  breakpoints: {
    sm: "768px",
    md: "992px",
    lg: "1200px",
  },
  custom: {
    "color-primary": "var(--color-primary)",
    "color-secondary": "var(--color-secondary)",
    "color-tertiary": "var(--color-tertiary)",
    "color-quaternary": "var(--color-quaternary)",
  },
};

function pixelToRem(rootFontSize) {
  return ({ styles, addStyles }) => {
    addStyles(
      Object.entries(styles).reduce((obj, [breakpoint, style]) => {
        return {
          ...obj,
          [breakpoint]: Object.entries(style).reduce((obj, [selector, css]) => {
            const [property, value] = css;
            if (/[\d.]*px/g.test(value)) {
              const newValue = value.replace(/[\d.]*px/g, (val) => {
                const num = val.replace("px", "");
                return `${(num * 62.5) / rootFontSize / 10}rem`;
              });
              return {
                ...obj,
                [selector]: [property, newValue],
              };
            }
            return {
              ...obj,
              [selector]: css,
            };
          }, {}),
        };
      }, {})
    );
  };
}
// use pixelToRem: fz:14px -> css { font-size: ...rem }

function testplugin2() {
  return ({ addBase }) => {
    addBase(`.testttttttttt { color: red }`);
  };
}
```

### CLI (file package.json)

```json
{
  ...
  "scripts": {
    ...
    "mota-css": "mota-css --port 4321",
    "mota-css:watch": "yarn mota-css --watch"
  },
  ...
}
```

### Compile

`npm run mota-css:watch` or `yarn mota-css:watch`

### Intelligent Mota CSS tooling for VS Code

<https://marketplace.visualstudio.com/items?itemName=wiloke.mota-css-intellisense>

<img src="https://raw.githubusercontent.com/wiloke1/mota-css-example/main/.github/banner.png" alt="" />

### Syntax

```css
<property>:<value>|<pseudo>|<pseudo><important -> "!">...@<media>

Eg:

Class Name               CSS
-----------------------------------------------------------------------------------------
c:red                 -> .c\:red { color: red }
bgc:blue!             -> .bgc\:blue\! { background-color: blue !important }
bd:1px_solid_yellow   -> .bd\:1px_solid_yellow { border: 1px solid yellow }
p:30px@md             -> @media (min-width:992px) { .p\:30px\@md { padding: 30px }
m:20px@+300px         -> @media (max-width:300px) { .m\:20px\@\+300px { margin: 20px } }
fz:20px|h             -> .fz\:20px\|h:hover { font-size: 20px }
cnt:(After_cnt)||af   -> .cnt\:\(After_cnt\)\|\|af::after { content: 'After ctn' }
cnt:(Before_cnt)|be   -> .cnt\:\(Before_cnt\)\|be:before { content: 'Before ctn' }
cnt:(Hover)|h||be     -> .cnt\:\(Hover\)\|be:hover:before { content: 'Hover' }
trf:scale(2)          -> .trf/:scale\(2\) { transform: scale(2) }
m:calc(20px_+_10px)   -> .m\:calc\(20px_+_10px\) { margin: calc(20px + 10px) }
```

### Html

```html
<div class="c:red c:blue|h bgc:color-primary fz:20px ml:10px w:30%@md p:30px@md m:20px@+300px pos:relative!"></div>
```

### Generated css code

```css
.c\:red { color: red }
.c\:blue\|h:hover { color: blue }
.bgc\:color-primary { background-color: var(--color-primary) }
.fz\:20px { font-size: 20px }
.ml\:10px { margin-left: 10px }
[dir="rtl"] .ml\:10px { margin-right: 10px }
.pos\:relative\! { position: relative !important }
@media (max-width:300px) { 
.m\:20px\@\+300px { margin: 20px } }
@media (min-width:992px) { 
.p\:30px\@md { padding: 30px }
.w\:30\%\@md { width: 30% } }
```

### Use in js or ts

```js
import { atomic } from 'mota-css';

atomic.setConfig({
  breakpoints: {
    sm: '768px',
    md: '992px',
    lg: '1200px',
  },
  cache: true,
  parentSelector: '',
  exclude: [],
  custom: {
    'color-primary': 'var(--color-primary)',
    'color-secondary': 'var(--color-secondary)'
  },
});

atomic.plugins([rtl(), pfs()]);

atomic.customValue(value => {
  console.log(value);
  return value;
});

atomic
  .find(`<div class="c:red c:blue|h fz:20px w:30%@md p:30px@md m:20px@+300px pos:relative!"></div>`);
  .find(`const className = "bgc:blue";`);

const id = atomic.on('success', css => {
  console.log(atomic.getCss());
});

// atomic.off(id);

atomic.on('valid', diagnostic => {
  console.log(diagnostic);
});

atomic.on('invalid', diagnostic => {
  console.log(diagnostic);
});

```
