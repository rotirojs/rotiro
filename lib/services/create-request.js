"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = void 0;
const utils_1 = require("../utils");
const path_matcher_1 = require("../utils/path-matcher");
const request_params_1 = require("../utils/request-params");
const send_response_1 = require("./send-response");
function createRequest(fullPath, method, endpoints, mappers, body) {
    const { path, query } = utils_1.splitFullPath(fullPath);
    const routePatterns = endpoints.getRoutePatterns();
    const routeName = path_matcher_1.getRouteName(path, routePatterns);
    const endpoint = endpoints.get(routeName);
    const methodSchema = endpoint.methods[method] || {};
    const bodyParams = methodSchema.bodyParams
        ? request_params_1.getBodyParams(body, methodSchema.bodyParams, mappers)
        : {};
    const queryParams = methodSchema.queryParams
        ? request_params_1.getQueryParams(query, methodSchema.queryParams, mappers)
        : {};
    const pathParams = request_params_1.getPathParams(path, endpoint, mappers);
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
        sendResponse: send_response_1.sendResponse
    };
}
exports.createRequest = createRequest;
//# sourceMappingURL=create-request.js.map