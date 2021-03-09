import { Endpoints } from '../classes';
import { Mappers } from '../classes/mappers';
import {
  ApiEndpointSchema,
  ApiRequest,
  MethodSchema,
  RestMethods,
  RouteNamePattern
} from '../type-defs';
import { splitFullPath } from '../utils';
import { getRouteName } from '../utils/path-matcher';
import {
  getBodyParams,
  getPathParams,
  getQueryParams
} from '../utils/request-params';
import { sendResponse } from './send-response';

export function createRequest(
  fullPath: string,
  method: RestMethods,
  endpoints: Endpoints,
  mappers: Mappers,
  rawBody?: object
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

  return {
    routeName,
    pathPattern: endpoint.pattern,
    pathName,
    authTokenName: methodSchema.auth,
    method,
    valid: false,
    authenticated: false,
    path: pathParams,
    body,
    query,
    rawBody,
    rawQuery,
    request: null,
    sendResponse
  };
}
