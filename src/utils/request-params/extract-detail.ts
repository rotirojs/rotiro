import {RequestDetail, RestMethods} from '../../type-defs';
import {createError, ErrorCodes} from '../../errors/error-codes';
import {cleanBasePath} from '../paths';
import {ExtractedRequestDetail} from '../../type-defs/internal';

export function extractRequestDetails(
  requestDetail: RequestDetail,
  basePath: string
): ExtractedRequestDetail {
  if (!requestDetail.url || !requestDetail.method) {
    throw createError(ErrorCodes.E103);
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
    ? requestDetail.body || {}
    : {};

  return { fullPath, method, body };
}
