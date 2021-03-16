"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthToken = void 0;
const error_codes_1 = require("../errors/error-codes");
const text_1 = require("./text");
function getAuthToken(tokenName, headers, query) {
    if (!headers) {
        throw error_codes_1.createError(error_codes_1.ErrorCodes.E114);
    }
    tokenName = text_1.trimString(tokenName).toLowerCase();
    if (!tokenName) {
        throw error_codes_1.createError(error_codes_1.ErrorCodes.E115);
    }
    const authTokenValue = headers[tokenName];
    if (typeof authTokenValue !== 'undefined') {
        return authTokenValue;
    }
    if (query) {
        for (const headerKey of Object.keys(query)) {
            if (headerKey.toLowerCase() === tokenName) {
                return query[headerKey].value;
            }
        }
    }
    return '';
}
exports.getAuthToken = getAuthToken;
//# sourceMappingURL=auth-token.js.map