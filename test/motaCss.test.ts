import { MotaCss } from '../src/motaCss/motaCss';
import { pfs } from '../src/motaCss/plugins/pfs'

const shortTests = [
  {
    input: 'Test -> <div class="pos:relative c:red c:blue|h"></div>',
    output: `
      .c\\:red { color: red }
      .c\\:blue\\|h:hover { color: blue }
      .pos\\:relative { position: relative }
    `
  },
  {
    input: 'Test any file -> "w:100%  ml:30px"',
    output: `
      .ml\\:30px { margin-left: 30px }
      .w\\:100\\% { width: 100% }
    `
  },
  {
    input: `Before or After content -> <div class="cnt:(After)|af"></div>`,
    output: `
      .cnt\\:\\(After\\)\\|af:after { content: 'After' }
    `
  },
  {
    input: `Before or After content -> <div class="cnt:(After_2)|after"></div>`,
    output: `
    .cnt\\:\\(After_2\\)\\|after:after { content: 'After 2' }
    `
  },
  {
    input: 'Pfs function use clamp -> <div class="fz:pfs(30px,40px)"></div>',
    output: '.fz\\:pfs\\(30px\\,40px\\) { font-size: clamp(30px, 1.25vw + 25px, 40px) }'
  },
  {
    input: 'Pseudo hover and before -> <div class="bgc:red|hover|before"></div>',
    output: '.bgc\\:red\\|hover\\|before:hover:before { background-color: red }'
  },
  {
    input: `Before or After content error -> <div class="content:(Test error space)|after"></div>`,
    output: ''
  },
  {
    input: `Before or After content error -> <div class="cnt:(Test error space)|after"></div>`,
    output: ''
  },
  {
    input: 'Space with "_" -> <div class="bd:1px_solid_red"></div>',
    output: '.bd\\:1px_solid_red { border: 1px solid red }'
  },
  {
    input: 'Calc and important -> <div class="h:calc(10px_+_20px)!"></div>',
    output: '.h\\:calc\\(10px_\\+_20px\\)\\! { height: calc(10px + 20px) !important }'
  },
  {
    input: 'Pfs function negative -> <div class="m:pfs(-15px,-20px)"></div>',
    output: '.m\\:pfs\\(-15px\\,-20px\\) { margin: clamp(-15px, -0.625vw - 12.5px, -20px) }'
  },
  {
    input: 'Responsive min-width -> <div class="w:50%@md"></div>',
    output: '@media (min-width:992px) { .w\\:50\\%\\@md { width: 50% } }'
  },
  {
    input: 'Responsive max-width -> <div class="p:10px@+md"></div>',
    output: '@media (max-width:991px) { .p\\:10px\\@\\+md { padding: 10px } }'
  },
  {
    input: 'Javascript -> itemEl.classList.remove("trf:scale(1)");',
    output: '.trf\\:scale\\(1\\) { transform: scale(1) }'
  }
]

describe('Atomic', () => {
  shortTests.forEach(({input, output}) => {
    it(input, () => {
      const atomic = new MotaCss();
      atomic.setConfig();
      atomic.plugins([pfs()])
      atomic.find(input);
      const actual = atomic.getCss().replace(/\n/g, '').trim();
      expect(actual).toBe(output.replace(/\n\s*\./g, '.').trim());
    });
  });
});
