import { RotiroError } from './rotiro-error';

export enum ErrorCodes {
  E101,
  E102,
  E103,
  E104,
  E105,
  E106,
  E107,
  E108,
  E109,
  E110,
  E111,
  E112,
  E113,
  E114,
  E115,
  E116,
  E117,
  E118
}

const ErrorMessages = {
  [ErrorCodes.E101]: { code: 101, message: 'Path not found' },
  [ErrorCodes.E102]: { code: 102, message: 'Api not built' },
  [ErrorCodes.E103]: { code: 103, message: 'Original request not valid' },
  [ErrorCodes.E104]: { code: 104, message: 'Controller Error' },
  [ErrorCodes.E105]: {
    code: 105,
    message: 'Api is locked and cannot be updated'
  },
  [ErrorCodes.E106]: { code: 106, message: 'Auth token not supported' },
  [ErrorCodes.E107]: { code: 107, message: 'Route not supported' },
  [ErrorCodes.E108]: { code: 108, message: 'Invalid route name' },
  [ErrorCodes.E109]: { code: 109, message: 'Route name already added' },
  [ErrorCodes.E110]: {
    code: 110,
    message: 'Path parameters do not match schema'
  },
  [ErrorCodes.E111]: { code: 111, message: 'Invalid path' },
  [ErrorCodes.E112]: { code: 112, message: 'Path already added' },
  [ErrorCodes.E113]: { code: 113, message: 'No methods defined' },
  [ErrorCodes.E114]: { code: 114, message: 'Invalid request' },
  [ErrorCodes.E115]: { code: 115, message: 'Invalid token name' },
  [ErrorCodes.E116]: { code: 116, message: 'Invalid parameters' },
  [ErrorCodes.E117]: {
    code: 117,
    message: 'Not all endpoints have a controller'
  },
  [ErrorCodes.E118]: {
    code: 118,
    message: 'One or more auth tokens to not have a handler'
  }
};

export function createError(errorCode: ErrorCodes, content?: any): RotiroError {
  const errorInfo: any = ErrorMessages[errorCode];

  return new RotiroError(errorInfo.message, content, errorInfo.code);
}
