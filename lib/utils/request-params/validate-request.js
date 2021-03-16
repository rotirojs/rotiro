"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
function validateRequest(path, body, query) {
    if (path) {
        for (const pathValue of Object.values(path)) {
            if (!pathValue.valid) {
                return false;
            }
        }
    }
    if (body) {
        for (const bodyValue of Object.values(body)) {
            if (!bodyValue.valid) {
                return false;
            }
        }
    }
    if (query) {
        for (const queryValue of Object.values(query)) {
            if (!queryValue.valid) {
                return false;
            }
        }
    }
    return true;
}
exports.validateRequest = validateRequest;
//# sourceMappingURL=validate-request.js.map