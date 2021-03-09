"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const create_request_1 = require("../services/create-request");
const utils_1 = require("../utils");
const authenticators_1 = require("./authenticators");
const controllers_1 = require("./controllers");
const endpoints_1 = require("./endpoints");
const mappers_1 = require("./mappers");
const routes_1 = require("./routes");
class Api {
    constructor(options) {
        this.options = options;
        this._locked = false;
        this.basePath = utils_1.cleanBasePath(this.options.basePath || '');
        this._authenticators = new authenticators_1.Authenticators();
        this._endpoints = new endpoints_1.Endpoints();
        this._controllers = new controllers_1.Controllers();
        this._mappers = new mappers_1.Mappers();
        this._routes = new routes_1.Routes(this.endpoints, this.controllers);
    }
    get controllers() {
        return this._controllers;
    }
    get routes() {
        return this._routes;
    }
    get endpoints() {
        return this._endpoints;
    }
    get mappers() {
        return this._mappers;
    }
    get authenticators() {
        return this._authenticators;
    }
    get locked() {
        return this._locked;
    }
    static create(options = {}) {
        return new Api(options);
    }
    static extractRequestDetails(request, basePath) {
        if (!request.originalUrl || !request.method) {
            throw new Error('Original request not valid');
        }
        let fullPath = utils_1.cleanBasePath(request.originalUrl);
        if (basePath.length <= fullPath.length) {
            fullPath = fullPath.substr(basePath.length);
        }
        if (fullPath.length === 0) {
            fullPath = '/';
        }
        const method = request.method.toUpperCase();
        const body = ['PUT', 'PATCH', 'POST'].includes(method)
            ? request.body
            : {};
        return { fullPath, method, body };
    }
    build() {
        const endpointNames = this._endpoints.getRoutesAndMethods();
        const controllerErrors = this._controllers.validateControllers(endpointNames);
        if (controllerErrors.length) {
            const errorMessage = `Not all endpoints have a controller (${controllerErrors.join(', ')})`;
            throw new Error(errorMessage);
        }
        const authTokens = this._endpoints.getAuthTokenNames();
        if (authTokens.length) {
            const authenticatorErrors = this.authenticators.validateAuthenticators(authTokens);
            if (authenticatorErrors.length) {
                const errorMessage = `One or more auth tokens to not have a handler (${authenticatorErrors.join(', ')})`;
                throw new Error(errorMessage);
            }
        }
        this._authenticators.lock();
        this._endpoints.lock();
        this._controllers.lock();
        this._mappers.lock();
        this._locked = true;
    }
    router() {
        const self = this;
        return (request, response) => __awaiter(this, void 0, void 0, function* () {
            if (!self.locked) {
                throw new Error('Api not built');
            }
            const { method, body, fullPath } = Api.extractRequestDetails(request, this.basePath);
            let apiRequest;
            try {
                apiRequest = create_request_1.createRequest(fullPath, method, this.endpoints, this.mappers, body);
            }
            catch (ex) {
                if (!this.options.custom404 && ex.message === 'Path not found') {
                    response.status(404).send('Not Found');
                    return;
                }
                else {
                    throw ex;
                }
            }
            apiRequest.request = request;
            apiRequest.response = response;
            if (apiRequest.authTokenName) {
                const authenticator = this.authenticators.get(apiRequest.authTokenName);
                apiRequest.authenticated = yield authenticator(apiRequest);
                if (!apiRequest.authenticated) {
                    return self.sendError(response, {
                        statusCode: 401,
                        message: 'Unauthorized'
                    });
                }
            }
            const func = self.controllers.get(apiRequest.routeName, method);
            try {
                func.call(self, apiRequest);
            }
            catch (ex) {
                self.sendError(response, { statusCode: 500, message: 'Unknown error' });
            }
        });
    }
    sendError(response, error) {
        response.status(error.statusCode).send(error);
    }
}
exports.Api = Api;
//# sourceMappingURL=api.js.map