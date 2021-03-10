import { createError, ErrorCodes } from '../errors/error-codes';
import { trimString } from './text';

export function getAuthToken(request: any, tokenName: string): string {
  if (!request) {
    throw createError(ErrorCodes.E114);
  }

  tokenName = trimString(tokenName).toLowerCase();

  if (!tokenName) {
    throw createError(ErrorCodes.E115);
  }
  if (request.headers) {
    for (const header of Object.keys(request.headers)) {
      if (header.toLowerCase() === tokenName) {
        return request.headers[header];
      }
    }
  }

  if (request.query) {
    for (const header of Object.keys(request.query)) {
      if (header.toLowerCase() === tokenName) {
        return request.query[header];
      }
    }
  }

  return '';
}
