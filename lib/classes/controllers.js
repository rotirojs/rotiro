"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controllers = void 0;
class Controllers {
    constructor() {
        this.controllers = {};
        this._locked = false;
    }
    get locked() {
        return this._locked;
    }
    lock() {
        this._locked = true;
    }
    add(routeName, method, controller) {
        if (this._locked) {
            throw new Error('Api is locked and cannot be updated');
        }
        if (!this.controllers[routeName]) {
            this.controllers[routeName] = {};
        }
        const controllers = this.controllers[routeName];
        controllers[method] = controller;
    }
    validateControllers(routes) {
        const errors = [];
        for (const route of routes) {
            const controllers = this.controllers[route.routeName];
            if (controllers) {
                for (const method of route.methods) {
                    if (typeof controllers[method] === 'undefined') {
                        errors.push(`${route.routeName}:${method}`);
                    }
                }
            }
            else {
                for (const method of route.methods) {
                    errors.push(`${route.routeName}:${method}`);
                }
            }
        }
        return errors;
    }
    get(routeName, method) {
        const controllers = this.controllers[routeName];
        if (controllers) {
            return controllers[method];
        }
        throw new Error('Route not supported');
    }
}
exports.Controllers = Controllers;
//# sourceMappingURL=controllers.js.map