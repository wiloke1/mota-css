const fs = require('fs');
const http = require('http');
const path = require('path');
const chokidar = require('chokidar');
const { program } = require('commander');
const glob = require('glob');
const { atomic } = require('./dist/index');
const { input: configInput, output: configOutput, customValue, ...config } = require(path.resolve(process.cwd(), 'mota-css.config.js'));

const server = http.createServer();
const input = configInput || './src';
let started = false;

function log(str, color = 36) {
  return console.log(`\x1b[${color}m${str}\x1b[0m`);
}

program.version(require('./package.json').version);

program
  .option('-p, --port <number>', 'port to listen on', parseInt)
  .option('-w, --watch', 'watch for changes and reload')
  .parse(process.argv);

const options = program.opts();
const PORT = options.port || 4321;

atomic.setConfig(config);
if (customValue) {
  atomic.customValue(customValue);
}

atomic.subscribe(css => {
  fs.writeFileSync(path.resolve(process.cwd(), configOutput), css);
  started = true;
});

atomic.on('success', data => {
  if (started) {
    const { message, className, css } = data;
    log(`✅ ${message} ( class: "${className}" -> css: "${css}" )`, 32);
  }
});

atomic.on('failure', data => {
  const { message, className, css } = data;
  log(`⚠️  ${message} ( class: "${className}" -> css: "${css}" )`, 31);
});

function atomicFind(file) {
  fs.readFile(path.resolve(process.cwd(), file), 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    atomic.find(data);
  });
}

function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    atomicFind(files[i]);
  }
}

function initial() {
  if (typeof input === 'string') {
    const files = glob.sync(input);
    handleFiles(files);
  } else if (Array.isArray(input)) {
    for (let i = 0; i < input.length; i++) {
      const fileGlob = input[i];
      const files = glob(fileGlob, (err, files) => {
        if (err) {
          throw err;
        }
        handleFiles(files);
      });
    }
  }
}

function watchFiles() {
  chokidar.watch(configInput).on('change', atomicFind);
}

if (options.watch) {
  server.listen(PORT, () => {
    initial();
    watchFiles();
    log(
      `
      *       )                        (   (
    (  \`   ( /(  *   )   (         (   )\\ ))\\ )
    )\\))(  )\\()\` )  /(   )\\        )\\ (()/(()/(
  ((_)()\\((_)\\ ( )(_)((((_)(    (((_) /(_)/(_))
  (_()((_) ((_(_(_()) )\\ _ )\\   )\\___(_))(_))
  |  \\/  |/ _ |_   _| (_)_\\(_) ((/ __/ __/ __|
  | |\\/| | (_) || |    / _ \\    | (__\\__ \\__ \\
  |_|  |_|\\___/ |_|   /_/ \\_\\    \\___|___|___/
    `,
      35,
    );
    log('\n🚀 MOTA CSS IS READY\n');
  });
} else {
  initial();
}
