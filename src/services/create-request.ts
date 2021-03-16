import { Endpoints } from '../classes';
import { Mappers } from '../classes/mappers';
import {
  ApiEndpointSchema,
  ApiRequest,
  ApiRequestParam,
  MethodSchema,
  RestMethods,
  RouteNamePattern,
  SendResponse
} from '../type-defs';
import { splitFullPath } from '../utils';
import { getRouteName } from '../utils/path-matcher';
import {
  getBodyParams,
  getPathParams,
  getQueryParams
} from '../utils/request-params';
import {validateRequest} from '../utils/request-params/validate-request';

export function createRequest(
  fullPath: string,
  method: RestMethods,
  endpoints: Endpoints,
  mappers: Mappers,
  rawBody?: object,
  headers?: Record<string, string>
): ApiRequest {
  const { path: pathName, query: rawQuery } = splitFullPath(fullPath);

  const routePatterns: RouteNamePattern[] = endpoints.getRoutePatterns();
  const routeName: string = getRouteName(pathName, routePatterns);
  const endpoint: ApiEndpointSchema = endpoints.get(routeName);
  const methodSchema: MethodSchema = endpoint.methods[method] || {};
  const body = methodSchema.bodyParams
    ? getBodyParams(rawBody, methodSchema.bodyParams, mappers)
    : {};
  const query = methodSchema.queryParams
    ? getQueryParams(rawQuery, methodSchema.queryParams, mappers)
    : {};
  const pathParams = getPathParams(pathName, endpoint, mappers);

  const apiRequest: ApiRequest = {
    routeName,
    pathPattern: endpoint.pattern,
    pathName,
    method,
    valid: validateRequest(pathParams, body, query),
    authenticated: false,
    path: pathParams,
    body,
    query,
    headers: headers || {},
    meta: {},
    sendResponse: {} as SendResponse // stub out func until replaced
  };

  if (rawQuery) {
    apiRequest.rawQuery = rawQuery;
  }

  if (rawBody) {
    apiRequest.rawBody = rawBody;
  }

  if (methodSchema.auth) {
    apiRequest.authTokenName = methodSchema.auth;
  }

  return apiRequest;
}
//
// function isRequestValid(
//   path: Record<string, ApiRequestParam>,
//   body: Record<string, ApiRequestParam>,
//   query: Record<string, ApiRequestParam>
// ): boolean {
//   if (path) {
//     for (const pathValue of Object.values(path)) {
//       if (!pathValue.valid) {
//         return false;
//       }
//     }
//   }
//
//   if (body) {
//     for (const bodyValue of Object.values(body)) {
//       if (!bodyValue.valid) {
//         return false;
//       }
//     }
//   }
//
//   if (query) {
//     for (const queryValue of Object.values(query)) {
//       if (!queryValue.valid) {
//         return false;
//       }
//     }
//   }
//
//   return true;
// }
