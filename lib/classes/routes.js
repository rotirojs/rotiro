"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const error_codes_1 = require("../errors/error-codes");
const request_params_1 = require("../utils/request-params");
class Routes {
    constructor(endpoints, controllers) {
        this.endpoints = endpoints;
        this.controllers = controllers;
        this._locked = false;
    }
    get locked() {
        return this._locked;
    }
    lock() {
        this._locked = true;
    }
    add(name, path, config) {
        if (this.locked) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E105);
        }
        const pathParams = [];
        if (config.path) {
            for (const key of Object.keys(config.path)) {
                let pathParamType;
                if (typeof config.path[key] === 'string') {
                    pathParamType = config.path[key];
                }
                else {
                    pathParamType = config.path[key].type;
                }
                pathParams.push({ name: key, type: pathParamType });
            }
        }
        const methods = {};
        const supportedMethods = Object.keys(config.methods);
        if (!supportedMethods.length) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E113);
        }
        for (const method of supportedMethods) {
            const routeMethod = config.methods[method];
            const methodConfig = {};
            if (routeMethod.auth) {
                methodConfig.auth = routeMethod.auth;
            }
            if (routeMethod.body) {
                methodConfig.bodyParams = request_params_1.assignBodyParam(routeMethod.body);
            }
            if (routeMethod.query) {
                methodConfig.queryParams = request_params_1.assignBodyParam(routeMethod.query);
            }
            methods[method] = methodConfig;
            this.controllers.add(name, method, routeMethod.controller);
        }
        this.endpoints.add(name, path, methods, pathParams);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map