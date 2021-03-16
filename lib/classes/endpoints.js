"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoints = void 0;
const path_to_regexp_1 = require("path-to-regexp");
const error_codes_1 = require("../errors/error-codes");
const utils_1 = require("../utils");
const arrays_1 = require("../utils/arrays");
class Endpoints {
    constructor() {
        this._locked = false;
        this.endpoints = {};
        this.paths = {};
    }
    get locked() {
        return this._locked;
    }
    lock() {
        this._locked = true;
    }
    getRoutesAndMethods() {
        const routesAndMethods = [];
        Object.values(this.endpoints).forEach((endpoint) => {
            routesAndMethods.push({
                routeName: endpoint.routeName,
                methods: Object.keys(endpoint.methods)
            });
        });
        return routesAndMethods;
    }
    getAuthTokenNames() {
        const authTokenNames = {};
        Object.values(this.endpoints).forEach((endpoint) => {
            Object.values(endpoint.methods).forEach((schema) => {
                const auth = utils_1.trimString(schema.auth || '');
                if (auth) {
                    authTokenNames[auth] = auth;
                }
            });
        });
        return Object.values(authTokenNames);
    }
    getRoutePatterns() {
        return Object.values(this.endpoints).map((value) => {
            return { routeName: value.routeName, pattern: value.pattern };
        });
    }
    get(name) {
        if (!this.endpoints[name]) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E101);
        }
        return this.endpoints[name];
    }
    add(name, path, methods, pathParams = []) {
        if (this.locked) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E105);
        }
        const routeName = utils_1.trimString(name);
        if (!routeName.length) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E108);
        }
        if (this.endpoints[routeName]) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E109);
        }
        const routePath = utils_1.sanitisePath(path);
        const keys = [];
        const pattern = path_to_regexp_1.pathToRegexp(routePath, keys);
        const keyList = keys.map((key) => {
            return key.name;
        });
        if (!arrays_1.areListsEqual(keyList, pathParams.map((pathParam) => {
            return pathParam.name;
        }))) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E110);
        }
        if (!routePath.length) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E111);
        }
        if (this.paths[routePath]) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E112);
        }
        let endpointMethods;
        if (Array.isArray(methods)) {
            endpointMethods = {};
            for (const method of methods) {
                endpointMethods[method] = {};
            }
        }
        else {
            endpointMethods = Object.assign({}, methods);
        }
        const endpoint = {
            routeName,
            path: routePath,
            pathParams,
            pattern,
            methods: endpointMethods
        };
        this.endpoints[routeName] = endpoint;
        this.paths[routePath] = routeName;
        return endpoint;
    }
}
exports.Endpoints = Endpoints;
//# sourceMappingURL=endpoints.js.map