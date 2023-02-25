module.exports = {
  rollup(config, options) {
    // Disable source maps
    config.output.sourcemap = false;
    return config;
  },
};
