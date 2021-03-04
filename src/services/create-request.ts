import { Endpoints } from "../classes";
import { Mappers } from "../classes/mappers";
import {
  ApiEndpointSchema,
  ApiRequest,
  MethodSchema,
  RestMethods,
  RouteNamePattern
} from "../type-defs";
import { splitFullPath } from "../utils";
import { getRouteName } from "../utils/path-matcher";
import {
  getBodyParams,
  getPathParams,
  getQueryParams
} from "../utils/request-params";
import { sendResponse } from "./send-response";

export function createRequest(
  fullPath: string,
  method: RestMethods,
  endpoints: Endpoints,
  mappers: Mappers,
  body?: object
): ApiRequest {
  const { path, query } = splitFullPath(fullPath);

  const routePatterns: RouteNamePattern[] = endpoints.getRoutePatterns();
  const routeName: string = getRouteName(path, routePatterns);
  const endpoint: ApiEndpointSchema = endpoints.get(routeName);
  const methodSchema: MethodSchema = endpoint.methods[method] || {};
  const bodyParams = methodSchema.bodyParams
    ? getBodyParams(body, methodSchema.bodyParams, mappers)
    : {};
  const queryParams = methodSchema.queryParams
    ? getQueryParams(query, methodSchema.queryParams, mappers)
    : {};
  const pathParams = getPathParams(path, endpoint, mappers);

  return {
    routeName,
    pathPattern: endpoint.pattern,
    path,
    authTokenName: methodSchema.auth,
    method,
    valid: false,
    authenticated: false,
    pathParams,
    bodyParams,
    queryParams,
    body,
    query,
    request: null,
    sendResponse
  };
}
