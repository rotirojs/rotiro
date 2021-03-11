import { createError, ErrorCodes } from '../errors/error-codes';
import { createRequest } from '../services/create-request';
import {
  ApiOptions,
  ApiRequest,
  AuthenticatorFunc,
  ErrorMessage,
  RestMethods
} from '../type-defs';
import { cleanBasePath } from '../utils';
import { Authenticators } from './authenticators';
import { Controllers } from './controllers';
import { Endpoints } from './endpoints';
import { Mappers } from './mappers';
import { Routes } from './routes';
import { RotiroErrorResponse } from '../errors';
import { HttpErrors } from '../errors/http-error-codes';

export class Api {
  public get controllers(): Controllers {
    return this._controllers;
  }

  public get routes(): Routes {
    return this._routes;
  }

  public get endpoints(): Endpoints {
    return this._endpoints;
  }

  public get mappers(): Mappers {
    return this._mappers;
  }

  public get authenticators(): Authenticators {
    return this._authenticators;
  }

  public get locked(): boolean {
    return this._locked;
  }

  // to handle alternatives to express
  private static extractRequestDetails(
    request: any,
    basePath: string
  ): { method: RestMethods; body: any; fullPath: string } {
    if (!request.originalUrl || !request.method) {
      throw createError(ErrorCodes.E103);
    }

    let fullPath = cleanBasePath(request.originalUrl);

    // remove the base path from the original url
    if (basePath.length <= fullPath.length) {
      fullPath = fullPath.substr(basePath.length);
    }

    if (fullPath.length === 0) {
      fullPath = '/';
    }

    const method: RestMethods = request.method.toUpperCase() as RestMethods;
    const body: object = ['PUT', 'PATCH', 'POST'].includes(method)
      ? request.body
      : {};

    return { fullPath, method, body };
  }
  private readonly _routes: Routes;
  private readonly _authenticators: Authenticators;
  private readonly _endpoints: Endpoints;
  private readonly _controllers: Controllers;
  private readonly _mappers: Mappers;
  private readonly basePath: string;
  private readonly options: ApiOptions;

  private _locked: boolean = false;

  constructor(options?: ApiOptions) {
    this.options = options || {};
    this.basePath = cleanBasePath(this.options.basePath || '');

    this._authenticators = new Authenticators();
    this._endpoints = new Endpoints();
    this._controllers = new Controllers();
    this._mappers = new Mappers();
    this._routes = new Routes(this.endpoints, this.controllers);
  }

  public build(): void {
    // check any endpoints have controllers
    // prevent any updates to controller etc

    const endpointNames = this._endpoints.getRoutesAndMethods();
    const controllerErrors: string[] = this._controllers.validateControllers(
      endpointNames
    );

    if (controllerErrors.length) {
      throw createError(ErrorCodes.E117, controllerErrors);
    }

    const authTokens: string[] = this._endpoints.getAuthTokenNames();
    if (authTokens.length) {
      // validate they all exists
      const authenticatorErrors = this.authenticators.validateAuthenticators(
        authTokens
      );
      if (authenticatorErrors.length) {
        throw createError(ErrorCodes.E118, authenticatorErrors);
      }
    }

    this._authenticators.lock();
    this._endpoints.lock();
    this._controllers.lock();
    this._mappers.lock();
    this._locked = true;
  }

  public router() {
    const self = this;
    return async (request: any, response: any) => {
      if (!self.locked) {
        throw createError(ErrorCodes.E102);
      }

      const {
        method,
        body,
        fullPath
      }: {
        method: RestMethods;
        body: any;
        fullPath: string;
      } = Api.extractRequestDetails(request, this.basePath);

      let apiRequest: ApiRequest;
      try {
        apiRequest = createRequest(
          fullPath,
          method,
          this.endpoints,
          this.mappers,
          body
        );
      } catch (ex) {
        this.handleRouteError(ex, response);
        return;
      }

      apiRequest.request = request;
      apiRequest.response = response;

      if (apiRequest.authTokenName) {
        // call authenticator
        const authenticator: AuthenticatorFunc = this.authenticators.get(
          apiRequest.authTokenName
        );
        apiRequest.authenticated = await authenticator(apiRequest);
        if (!apiRequest.authenticated) {
          // throw an error
          return self.sendError(response, {
            statusCode: 401,
            message: 'Unauthorized'
          });
        }
      }
      const func = self.controllers.get(apiRequest.routeName, method);

      // update the request and response object before passing it in

      try {
        // test auth
        func.call(self, apiRequest);
      } catch (ex) {
        // look for a particular error structure and return
        // otherwise return a 500
        self.sendError(response, { statusCode: 500, message: 'Unknown error' });
      }
    };
  }

  private sendError(response: any, error: ErrorMessage) {
    // This needs to manage more than just express in the future
    // add middleware hook to manage sending a response
    response.status(error.statusCode).send(error);
  }

  private handleRouteError(ex: any, response: any) {
    switch (ex.name) {
      case 'RotiroErrorResponse':
        // status or 500
        const responseError: RotiroErrorResponse = ex;

        response
          .status(responseError.status)
          .send(
            responseError.content ||
              responseError.message ||
              HttpErrors[responseError.status] ||
              'Api Error'
          );

        return;
      case 'RotiroError':
        if (!this.options.custom404 && ex.errorCode === 'E101') {
          // create a 404 response
          response.status(404).send('Not Found');
          return;
        }
        response.status(500).send('Internal Server Error');
        return;
    }
    // if (!this.options.custom404 && ex.message === 'Path not found') {
    //   // create a 404 response
    //   response.status(404).send('Not Found');
    //   return;
    // } else {
    //   throw ex;
    // }
  }
}
