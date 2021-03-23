import debug = require('debug');
const rotiroDebug = debug('rotiro:debug');
const rotiroError = debug('rotiro:error');

export const logger = {
  debug: (message: string) => {
    rotiroDebug(message);
  },
  error: (message: string) => {
    rotiroError(message);
  }
};
