import { RotiroError } from './rotiro-error';

export const RotiroErrorCode = {
  PathNotFound: 101,
  ApiNotBuild: 102,
  OriginalRequestNotValid: 103,
  ControllerError: 104,
  ApiLocked: 105,
  TokenNotSupported: 106,
  RouteNotSupported: 107,
  InvalidRouteName: 108,
  RouteNameAlreadyAdded: 109,
  InvalidPathParams: 110,
  InvalidPath: 111,
  PathAlreadyAdded: 112,
  NoMethodsDefined: 113,
  InvalidRequest: 114,
  InvalidTokenName: 115,
  InvalidParameters: 116,
  ControllerMissing: 117,
  UnassignedAuthToken: 118
};

export enum ErrorCodes {
  PathNotFound = RotiroErrorCode.PathNotFound,
  ApiNotBuild = RotiroErrorCode.ApiNotBuild,
  OriginalRequestNotValid = RotiroErrorCode.OriginalRequestNotValid,
  ControllerError = RotiroErrorCode.ControllerError,
  ApiLocked = RotiroErrorCode.ApiLocked,
  TokenNotSupported = RotiroErrorCode.TokenNotSupported,
  RouteNotSupported = RotiroErrorCode.RouteNotSupported,
  InvalidRouteName = RotiroErrorCode.InvalidRouteName,
  RouteNameAlreadyAdded = RotiroErrorCode.RouteNameAlreadyAdded,
  InvalidPathParams = RotiroErrorCode.InvalidPathParams,
  InvalidPath = RotiroErrorCode.InvalidPath,
  PathAlreadyAdded = RotiroErrorCode.PathAlreadyAdded,
  NoMethodsDefined = RotiroErrorCode.NoMethodsDefined,
  InvalidRequest = RotiroErrorCode.InvalidRequest,
  InvalidTokenName = RotiroErrorCode.InvalidTokenName,
  InvalidParameters = RotiroErrorCode.InvalidParameters,
  ControllerMissing = RotiroErrorCode.ControllerMissing,
  UnassignedAuthToken = RotiroErrorCode.UnassignedAuthToken
}

const ErrorMessages = {
  [ErrorCodes.PathNotFound]: {
    code: RotiroErrorCode.PathNotFound,
    message: 'Path not found'
  },
  [ErrorCodes.ApiNotBuild]: {
    code: RotiroErrorCode.ApiNotBuild,
    message: 'Api not built'
  },
  [ErrorCodes.OriginalRequestNotValid]: {
    code: RotiroErrorCode.OriginalRequestNotValid,
    message: 'Original request not valid'
  },
  [ErrorCodes.ControllerError]: {
    code: RotiroErrorCode.ControllerError,
    message: 'Controller Error'
  },
  [ErrorCodes.ApiLocked]: {
    code: RotiroErrorCode.ApiLocked,
    message: 'Api is locked and cannot be updated'
  },
  [ErrorCodes.TokenNotSupported]: {
    code: RotiroErrorCode.TokenNotSupported,
    message: 'Auth token not supported'
  },
  [ErrorCodes.RouteNotSupported]: {
    code: RotiroErrorCode.RouteNotSupported,
    message: 'Route not supported'
  },
  [ErrorCodes.InvalidRouteName]: {
    code: RotiroErrorCode.InvalidRouteName,
    message: 'Invalid route name'
  },
  [ErrorCodes.RouteNameAlreadyAdded]: {
    code: RotiroErrorCode.RouteNameAlreadyAdded,
    message: 'Route name already added'
  },
  [ErrorCodes.InvalidPathParams]: {
    code: RotiroErrorCode.InvalidPathParams,
    message: 'Path parameters do not match schema'
  },
  [ErrorCodes.InvalidPath]: {
    code: RotiroErrorCode.InvalidPath,
    message: 'Invalid path'
  },
  [ErrorCodes.PathAlreadyAdded]: {
    code: RotiroErrorCode.PathAlreadyAdded,
    message: 'Path already added'
  },
  [ErrorCodes.NoMethodsDefined]: {
    code: RotiroErrorCode.NoMethodsDefined,
    message: 'No methods defined'
  },
  [ErrorCodes.InvalidRequest]: {
    code: RotiroErrorCode.InvalidRequest,
    message: 'Invalid request'
  },
  [ErrorCodes.InvalidTokenName]: {
    code: RotiroErrorCode.InvalidTokenName,
    message: 'Invalid token name'
  },
  [ErrorCodes.InvalidParameters]: {
    code: RotiroErrorCode.InvalidParameters,
    message: 'Invalid parameters'
  },
  [ErrorCodes.ControllerMissing]: {
    code: RotiroErrorCode.ControllerMissing,
    message: 'Not all endpoints have a controller'
  },
  [ErrorCodes.UnassignedAuthToken]: {
    code: RotiroErrorCode.UnassignedAuthToken,
    message: 'One or more auth tokens to not have a handler'
  }
};

export function createError(errorCode: number, content?: any): RotiroError {
  const errorInfo: any = ErrorMessages[errorCode] || {
    code: errorCode,
    message: ''
  };

  return new RotiroError(errorInfo.message, content, errorInfo.code.toString());
}
