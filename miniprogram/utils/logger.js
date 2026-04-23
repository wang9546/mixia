const isDev = __wxConfig.envVersion !== 'release';

module.exports = {
  log:   (...args) => isDev && console.log(...args),
  warn:  (...args) => isDev && console.warn(...args),
  error: (...args) => console.error(...args)
};
