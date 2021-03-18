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
    send: {} as SendResponse // stub out func until replaced
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
