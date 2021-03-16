"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticators = void 0;
const error_codes_1 = require("../errors/error-codes");
class Authenticators {
    constructor() {
        this.authenticators = {};
        this._locked = false;
    }
    get locked() {
        return this._locked;
    }
    lock() {
        this._locked = true;
    }
    add(authTokenName, authenticator) {
        if (this._locked) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E105);
        }
        this.authenticators[authTokenName] = authenticator;
    }
    validateAuthenticators(authTokenNames) {
        const errors = [];
        for (const tokenName of authTokenNames) {
            const authenticator = this.authenticators[tokenName];
            if (!authenticator) {
                errors.push(`${tokenName} has no handler registered`);
            }
        }
        return errors;
    }
    get(authTokenName) {
        const authenticator = this.authenticators[authTokenName];
        if (authenticator) {
            return authenticator;
        }
        throw error_codes_1.createError(error_codes_1.ErrorCodes.E106);
    }
}
exports.Authenticators = Authenticators;
//# sourceMappingURL=authenticators.js.map