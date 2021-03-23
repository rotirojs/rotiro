import debug = require('debug');
const rotiroDebug = debug('rotiro:debug');
const rotiroError = debug('rotiro:error');
const rotiroDisplay = debug('rotiro:display');

export const logger = {
  debug: (message: string) => {
    rotiroDebug(message);
  },
  error: (message: string) => {
    rotiroError(message);
  },
  display: (message: string, content: any) => {
    // displays the content of an object
    if (rotiroDisplay.enabled) {
      // only process this if debugger is enabled since it could be an expensive function
      if (typeof content === 'undefined' || content === null) {
        return;
      }
      if (typeof content === 'object') {
        try {
          content = JSON.stringify(content);
        } catch (ex) {
          logger.error(`Logger Error displaying object ${ex}`);
          return;
        }
      }

      rotiroDisplay(`${message}: ${content}`);
    }
  }
};
