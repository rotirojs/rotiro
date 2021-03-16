"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = void 0;
const utils_1 = require("../utils");
const path_matcher_1 = require("../utils/path-matcher");
const request_params_1 = require("../utils/request-params");
function createRequest(fullPath, method, endpoints, mappers, rawBody, headers) {
    const { path: pathName, query: rawQuery } = utils_1.splitFullPath(fullPath);
    const routePatterns = endpoints.getRoutePatterns();
    const routeName = path_matcher_1.getRouteName(pathName, routePatterns);
    const endpoint = endpoints.get(routeName);
    const methodSchema = endpoint.methods[method] || {};
    const body = methodSchema.bodyParams
        ? request_params_1.getBodyParams(rawBody, methodSchema.bodyParams, mappers)
        : {};
    const query = methodSchema.queryParams
        ? request_params_1.getQueryParams(rawQuery, methodSchema.queryParams, mappers)
        : {};
    const pathParams = request_params_1.getPathParams(pathName, endpoint, mappers);
    const apiRequest = {
        routeName,
        pathPattern: endpoint.pattern,
        pathName,
        method,
        valid: false,
        authenticated: false,
        path: pathParams,
        body,
        query,
        headers: headers || {},
        meta: {},
        sendResponse: {}
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
exports.createRequest = createRequest;
//# sourceMappingURL=create-request.js.map