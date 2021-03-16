"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotiroErrorResponse = void 0;
const rotiro_error_1 = require("./rotiro-error");
class RotiroErrorResponse extends rotiro_error_1.RotiroError {
    constructor(message, status, content, errorCode) {
        super(message, content, errorCode);
        this.status = status;
    }
    get name() {
        return 'RotiroErrorResponse';
    }
}
exports.RotiroErrorResponse = RotiroErrorResponse;
//# sourceMappingURL=rotiro-error-response.js.map