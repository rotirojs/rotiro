"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthToken = void 0;
const text_1 = require("./text");
function getAuthToken(request, tokenName) {
    if (!request) {
        throw new Error('Invalid request');
    }
    tokenName = text_1.trimString(tokenName).toLowerCase();
    if (!tokenName) {
        throw new Error('Invalid token name');
    }
    if (request.headers) {
        for (const header of Object.keys(request.headers)) {
            if (header.toLowerCase() === tokenName) {
                return request.headers[header];
            }
        }
    }
    if (request.query) {
        for (const header of Object.keys(request.query)) {
            if (header.toLowerCase() === tokenName) {
                return request.query[header];
            }
        }
    }
    return '';
}
exports.getAuthToken = getAuthToken;
//# sourceMappingURL=auth-token.js.map