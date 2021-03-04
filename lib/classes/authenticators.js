"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticators = void 0;
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
            throw new Error('Api is locked and cannot be updated');
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
        throw new Error('Auth token not supported');
    }
}
exports.Authenticators = Authenticators;
//# sourceMappingURL=authenticators.js.map