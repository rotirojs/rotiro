"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathParams = void 0;
function getPathParams(path, endpoint, mappers) {
    const pathParams = {};
    if (endpoint.pathParams && endpoint.pathParams.length) {
        let params = path.match(endpoint.pattern);
        if (!params) {
            throw new Error('Invalid parameters');
        }
        params = params.slice(1, endpoint.pathParams.length + 1);
        for (let i = 0; i < endpoint.pathParams.length; i++) {
            const value = mappers.mapDataType(params[i], endpoint.pathParams[i].type);
            const requestParam = Object.assign(Object.assign({}, endpoint.pathParams[i]), { value, valid: typeof value !== 'undefined' });
            pathParams[requestParam.name] = requestParam;
        }
    }
    return pathParams;
}
exports.getPathParams = getPathParams;
//# sourceMappingURL=path-params.js.map