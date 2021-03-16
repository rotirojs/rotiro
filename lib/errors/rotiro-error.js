"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotiroError = void 0;
class RotiroError extends Error {
    constructor(message, content, errorCode) {
        super(message);
        this.content = content;
        this.errorCode = errorCode;
    }
    get name() {
        return 'RotiroError';
    }
}
exports.RotiroError = RotiroError;
//# sourceMappingURL=rotiro-error.js.map