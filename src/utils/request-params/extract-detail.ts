import { RotiroError } from '../../errors';
import { createError, ErrorCodes } from '../../errors/error-codes';
import { RequestDetail, RestMethods } from '../../type-defs';
import { ExtractedRequestDetail } from '../../type-defs/internal';
import { cleanBasePath } from '../paths';
import { trimString } from '../text';

export function extractRequestDetails(
  requestDetail: RequestDetail,
  basePath: string
): ExtractedRequestDetail {
  if (!requestDetail.url || !requestDetail.method) {
    throw createError(ErrorCodes.OriginalRequestNotValid);
  }

  const headers: Record<string, string> = cleanHeaders(requestDetail.headers);

  let fullPath = cleanBasePath(requestDetail.url);

  // remove the base path from the original url
  if (basePath.length <= fullPath.length) {
    fullPath = fullPath.substr(basePath.length);
  }

  if (fullPath.length === 0) {
    fullPath = '/';
  }

  const method: RestMethods = requestDetail.method.toUpperCase() as RestMethods;
  const body: object = ['PUT', 'PATCH', 'POST'].includes(method)
    ? formatBody(requestDetail.body, headers['content-type'])
    : {};

  return {
    fullPath,
    method,
    body,
    headers,
    meta: requestDetail.meta,
    originalRequest: requestDetail.originalRequest
  };
}

export function cleanHeaders(
  headers?: Record<string, string>
): Record<string, string> {
  const cleanedHeaders: Record<string, string> = {};

  if (headers) {
    for (const headerKey of Object.keys(headers)) {
      cleanedHeaders[headerKey.toLowerCase()] = headers[headerKey];
    }
  }
  return cleanedHeaders;
}

function formatBody(body: any, contentType: string): any {
  // for now ensure that any json body is parsed to an object
  // more content types may be supported in the future
  contentType = trimString(contentType).toLowerCase();
  if (contentType === 'application/json') {
    if (typeof body === 'string') {
      try {
        return JSON.parse(body);
      } catch (ex) {
        throw createError(
          ErrorCodes.OriginalRequestNotValid,
          'Body cannot be parsed as valid JSON'
        );
      }
    } else {
      return body || {};
    }
  }
  return body || '';
}
