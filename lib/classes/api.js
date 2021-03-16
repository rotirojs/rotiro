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
const error_codes_1 = require("../errors/error-codes");
const http_error_codes_1 = require("../errors/http-error-codes");
const create_request_1 = require("../services/create-request");
const get_response_detail_1 = require("../services/get-response-detail");
const utils_1 = require("../utils");
const auth_token_1 = require("../utils/auth-token");
const extract_detail_1 = require("../utils/request-params/extract-detail");
const authenticators_1 = require("./authenticators");
const controllers_1 = require("./controllers");
const endpoints_1 = require("./endpoints");
const mappers_1 = require("./mappers");
const routes_1 = require("./routes");
class Api {
    constructor(options) {
        this._locked = false;
        this.options = options || {};
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
    static handleRequest(api, middleware) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestDetail = middleware.requestDetail;
            if (!requestDetail.url || !requestDetail.method) {
                throw error_codes_1.createError(error_codes_1.ErrorCodes.E103);
            }
            const { method, body, fullPath, headers } = extract_detail_1.extractRequestDetails(requestDetail, api.basePath);
            let apiRequest;
            try {
                apiRequest = create_request_1.createRequest(fullPath, method, api.endpoints, api.mappers, body, headers);
            }
            catch (ex) {
                Api.handleRouteError(ex, middleware.sendResponse, api.options.custom404);
                return;
            }
            if (apiRequest.authTokenName) {
                const authenticator = api.authenticators.get(apiRequest.authTokenName);
                apiRequest.authTokenValue = auth_token_1.getAuthToken(apiRequest.authTokenName, apiRequest.headers, apiRequest.query);
                apiRequest.authenticated = yield authenticator(apiRequest);
                if (!apiRequest.authenticated) {
                    middleware.sendResponse(401, http_error_codes_1.HttpErrors[401], 'text/plain');
                }
            }
            const func = api.controllers.get(apiRequest.routeName, method);
            try {
                apiRequest.sendResponse = (bodyContent, status, contentType) => {
                    const responseDetail = get_response_detail_1.getResponseDetail(bodyContent, status, contentType);
                    middleware.sendResponse(responseDetail.statusCode, responseDetail.body, responseDetail.contentType);
                };
                func.call(undefined, apiRequest);
            }
            catch (ex) {
                Api.handleRouteError(ex, middleware.sendResponse, api.options.custom404);
                return;
            }
        });
    }
    static handleRouteError(ex, sendResponse, custom404) {
        switch (ex.name) {
            case 'RotiroErrorResponse':
                const responseError = ex;
                sendResponse(responseError.status, responseError.content ||
                    responseError.message ||
                    http_error_codes_1.HttpErrors[responseError.status] ||
                    'Api Error', 'text/plain');
                return;
            case 'RotiroError':
                if (ex.errorCode === 101) {
                    if (!custom404) {
                        sendResponse(404, http_error_codes_1.HttpErrors[404], 'text/plain');
                    }
                    else {
                        throw ex;
                    }
                }
                sendResponse(500, http_error_codes_1.HttpErrors[500], 'text/plain');
                return;
        }
    }
    build() {
        const endpointNames = this._endpoints.getRoutesAndMethods();
        const controllerErrors = this._controllers.validateControllers(endpointNames);
        if (controllerErrors.length) {
            throw error_codes_1.createError(error_codes_1.ErrorCodes.E117, controllerErrors);
        }
        const authTokens = this._endpoints.getAuthTokenNames();
        if (authTokens.length) {
            const authenticatorErrors = this.authenticators.validateAuthenticators(authTokens);
            if (authenticatorErrors.length) {
                throw error_codes_1.createError(error_codes_1.ErrorCodes.E118, authenticatorErrors);
            }
        }
        this._authenticators.lock();
        this._endpoints.lock();
        this._controllers.lock();
        this._mappers.lock();
        this._locked = true;
    }
}
exports.Api = Api;
//# sourceMappingURL=api.js.map