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
    throw createError(ErrorCodes.E103);
  }

  const headers: Record<string, string> = {};

  if (requestDetail.headers) {
    for (const headerKey of Object.keys(requestDetail.headers)) {
      headers[headerKey.toLowerCase()] = requestDetail.headers[headerKey];
    }
  }
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

  return { fullPath, method, body, headers };
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
          ErrorCodes.E103,
          'Body cannot be parsed as valid JSON'
        );
      }
    } else {
      return body || {};
    }
  }
  return body || '';
}
