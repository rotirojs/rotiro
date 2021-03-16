"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRequestDetails = void 0;
const error_codes_1 = require("../../errors/error-codes");
const paths_1 = require("../paths");
function extractRequestDetails(requestDetail, basePath) {
    if (!requestDetail.url || !requestDetail.method) {
        throw error_codes_1.createError(error_codes_1.ErrorCodes.E103);
    }
    const headers = requestDetail.headers || {};
    let fullPath = paths_1.cleanBasePath(requestDetail.url);
    if (basePath.length <= fullPath.length) {
        fullPath = fullPath.substr(basePath.length);
    }
    if (fullPath.length === 0) {
        fullPath = '/';
    }
    const method = requestDetail.method.toUpperCase();
    const body = ['PUT', 'PATCH', 'POST'].includes(method)
        ? requestDetail.body || {}
        : {};
    return { fullPath, method, body, headers };
}
exports.extractRequestDetails = extractRequestDetails;
//# sourceMappingURL=extract-detail.js.map