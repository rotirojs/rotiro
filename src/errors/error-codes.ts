import { RotiroError } from './rotiro-error';

export enum ErrorCodes {
  PathNotFound = 101,
  ApiNotBuild = 102,
  OriginalRequestNotValid = 103,
  ControllerError = 104,
  ApiLocked = 105,
  TokenNotSupported = 106,
  RouteNotSupported = 107,
  InvalidRouteName = 108,
  RouteNameAlreadyAdded = 109,
  InvalidPathParams = 110,
  InvalidPath = 111,
  PathAlreadyAdded = 112,
  NoMethodsDefined = 113,
  InvalidRequest = 114,
  InvalidTokenName = 115,
  InvalidParameters = 116,
  ControllerMissing = 117,
  UnassignedAuthToken = 118
}

const ErrorMessages = {
  [ErrorCodes.PathNotFound]: { code: 101, message: 'Path not found' },
  [ErrorCodes.ApiNotBuild]: { code: 102, message: 'Api not built' },
  [ErrorCodes.OriginalRequestNotValid]: {
    code: 103,
    message: 'Original request not valid'
  },
  [ErrorCodes.ControllerError]: { code: 104, message: 'Controller Error' },
  [ErrorCodes.ApiLocked]: {
    code: 105,
    message: 'Api is locked and cannot be updated'
  },
  [ErrorCodes.TokenNotSupported]: {
    code: 106,
    message: 'Auth token not supported'
  },
  [ErrorCodes.RouteNotSupported]: { code: 107, message: 'Route not supported' },
  [ErrorCodes.InvalidRouteName]: { code: 108, message: 'Invalid route name' },
  [ErrorCodes.RouteNameAlreadyAdded]: {
    code: 109,
    message: 'Route name already added'
  },
  [ErrorCodes.InvalidPathParams]: {
    code: 110,
    message: 'Path parameters do not match schema'
  },
  [ErrorCodes.InvalidPath]: { code: 111, message: 'Invalid path' },
  [ErrorCodes.PathAlreadyAdded]: { code: 112, message: 'Path already added' },
  [ErrorCodes.NoMethodsDefined]: { code: 113, message: 'No methods defined' },
  [ErrorCodes.InvalidRequest]: { code: 114, message: 'Invalid request' },
  [ErrorCodes.InvalidTokenName]: { code: 115, message: 'Invalid token name' },
  [ErrorCodes.InvalidParameters]: { code: 116, message: 'Invalid parameters' },
  [ErrorCodes.ControllerMissing]: {
    code: 117,
    message: 'Not all endpoints have a controller'
  },
  [ErrorCodes.UnassignedAuthToken]: {
    code: 118,
    message: 'One or more auth tokens to not have a handler'
  }
};

export function createError(errorCode: ErrorCodes, content?: any): RotiroError {
  const errorInfo: any = ErrorMessages[errorCode];

  return new RotiroError(errorInfo.message, content, errorInfo.code);
}
