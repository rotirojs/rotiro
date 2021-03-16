import { createError, ErrorCodes } from '../errors/error-codes';
import { ApiRequestParam } from '../type-defs';
import { trimString } from './text';

export function getAuthToken(
  tokenName: string,
  headers: Record<string, string>,
  query?: Record<string, ApiRequestParam>
): string {
  if (!headers) {
    throw createError(ErrorCodes.E114);
  }

  tokenName = trimString(tokenName).toLowerCase();

  if (!tokenName) {
    throw createError(ErrorCodes.E115);
  }

  const authTokenValue: string = headers[tokenName];
  if (typeof authTokenValue !== 'undefined') {
    return authTokenValue;
  }

  if (query) {
    for (const headerKey of Object.keys(query)) {
      if (headerKey.toLowerCase() === tokenName) {
        return query[headerKey].value;
      }
    }
  }

  return '';
}
