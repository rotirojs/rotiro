"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = void 0;
const utils_1 = require("../utils");
const path_matcher_1 = require("../utils/path-matcher");
const request_params_1 = require("../utils/request-params");
const send_response_1 = require("./send-response");
function createRequest(fullPath, method, endpoints, mappers, rawBody) {
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
        sendResponse: send_response_1.sendResponse
    };
}
exports.createRequest = createRequest;
//# sourceMappingURL=create-request.js.map