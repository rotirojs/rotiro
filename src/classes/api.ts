import { createError, ErrorCodes } from '../errors/error-codes';
import { createRequest } from '../services/create-request';
import {
  ApiOptions,
  ApiRequest,
  AuthenticatorFunc,
  ErrorMessage,
  RequestDetail,
  RestMethods,
  RotiroMiddleware,
  SendResponse
} from '../type-defs';
import { cleanBasePath } from '../utils';
import { Authenticators } from './authenticators';
import { Controllers } from './controllers';
import { Endpoints } from './endpoints';
import { Mappers } from './mappers';
import { Routes } from './routes';
import { RotiroErrorResponse } from '../errors';
import { HttpErrors } from '../errors/http-error-codes';
import { extractRequestDetails } from '../utils/request-params/extract-detail';
import {ExtractedRequestDetail} from '../type-defs/internal';

export class Api {
  private readonly _routes: Routes;
  private readonly _authenticators: Authenticators;
  private readonly _endpoints: Endpoints;
  private readonly _controllers: Controllers;
  private readonly _mappers: Mappers;
  private readonly basePath: string;
  private readonly options: ApiOptions;

  constructor(options?: ApiOptions) {
    this.options = options || {};
    this.basePath = cleanBasePath(this.options.basePath || '');

    this._authenticators = new Authenticators();
    this._endpoints = new Endpoints();
    this._controllers = new Controllers();
    this._mappers = new Mappers();
    this._routes = new Routes(this.endpoints, this.controllers);
  }

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

  private _locked: boolean = false;

  public get locked(): boolean {
    return this._locked;
  }

  public static async handleRequest(
    api: Api,
    middleware: RotiroMiddleware
  ): Promise<void> {
    const requestDetail: RequestDetail = middleware.requestDetail;

    if (!requestDetail.url || !requestDetail.method) {
      throw createError(ErrorCodes.E103);
    }
    const {
      method,
      body,
      fullPath
    }: ExtractedRequestDetail = extractRequestDetails(requestDetail, api.basePath);

    let apiRequest: ApiRequest;
    try {
      apiRequest = createRequest(
        fullPath,
        method,
        api.endpoints,
        api.mappers,
        body
      );
    } catch (ex) {
      Api.handleRouteError(ex, middleware.sendResponse, api.options.custom404);
      return;
    }

    if (apiRequest.authTokenName) {
      // call authenticator
      const authenticator: AuthenticatorFunc = api.authenticators.get(
        apiRequest.authTokenName
      );
      apiRequest.authenticated = await authenticator(apiRequest);
      if (!apiRequest.authenticated) {
        // throw an error
        middleware.sendResponse(401, HttpErrors[401], 'text/plain');

        // return self.sendError(response, {
        //   statusCode: 401,
        //   message: 'Unauthorized'
        // });
      }
    }
    const func = api.controllers.get(apiRequest.routeName, method);

    // update the request and response object before passing it in

    try {
      // test auth
      func.call(undefined, apiRequest);
    } catch (ex) {
      Api.handleRouteError(ex, middleware.sendResponse, api.options.custom404);
      return;
    }
  }

  // private static extractRequestDetails(
  //   requestDetail: RequestDetail,
  //   basePath: string
  // ): { method: RestMethods; body: any; fullPath: string } {
  //   if (!requestDetail.url || !requestDetail.method) {
  //     throw createError(ErrorCodes.E103);
  //   }
  //
  //   let fullPath = cleanBasePath(requestDetail.url);
  //
  //   // remove the base path from the original url
  //   if (basePath.length <= fullPath.length) {
  //     fullPath = fullPath.substr(basePath.length);
  //   }
  //
  //   if (fullPath.length === 0) {
  //     fullPath = '/';
  //   }
  //
  //   const method: RestMethods = requestDetail.method.toUpperCase() as RestMethods;
  //   const body: object = ['PUT', 'PATCH', 'POST'].includes(method)
  //     ? requestDetail.body || {}
  //     : {};
  //
  //   return { fullPath, method, body };
  // }

  // to handle alternatives to express
  // private static extractRequestDetails(
  //   request: any,
  //   basePath: string
  // ): { method: RestMethods; body: any; fullPath: string } {
  //   if (!request.originalUrl || !request.method) {
  //     throw createError(ErrorCodes.E103);
  //   }
  //
  //   let fullPath = cleanBasePath(request.originalUrl);
  //
  //   // remove the base path from the original url
  //   if (basePath.length <= fullPath.length) {
  //     fullPath = fullPath.substr(basePath.length);
  //   }
  //
  //   if (fullPath.length === 0) {
  //     fullPath = '/';
  //   }
  //
  //   const method: RestMethods = request.method.toUpperCase() as RestMethods;
  //   const body: object = ['PUT', 'PATCH', 'POST'].includes(method)
  //     ? request.body
  //     : {};
  //
  //   return {fullPath, method, body};
  // }

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

  // public router() {
  //   const self = this;
  //   return async (request: any, response: any) => {
  //     if (!self.locked) {
  //       throw createError(ErrorCodes.E102);
  //     }
  //
  //     const {
  //       method,
  //       body,
  //       fullPath
  //     }: {
  //       method: RestMethods;
  //       body: any;
  //       fullPath: string;
  //     } = Api.extractRequestDetails(request, this.basePath);
  //
  //     let apiRequest: ApiRequest;
  //     try {
  //       apiRequest = createRequest(
  //         fullPath,
  //         method,
  //         this.endpoints,
  //         this.mappers,
  //         body
  //       );
  //     } catch (ex) {
  //       this.handleRouteError(ex, response);
  //       return;
  //     }
  //
  //     apiRequest.request = request;
  //     apiRequest.response = response;
  //
  //     if (apiRequest.authTokenName) {
  //       // call authenticator
  //       const authenticator: AuthenticatorFunc = this.authenticators.get(
  //         apiRequest.authTokenName
  //       );
  //       apiRequest.authenticated = await authenticator(apiRequest);
  //       if (!apiRequest.authenticated) {
  //         // throw an error
  //         return self.sendError(response, {
  //           statusCode: 401,
  //           message: 'Unauthorized'
  //         });
  //       }
  //     }
  //     const func = self.controllers.get(apiRequest.routeName, method);
  //
  //     // update the request and response object before passing it in
  //
  //     try {
  //       // test auth
  //       func.call(self, apiRequest);
  //     } catch (ex) {
  //       this.handleRouteError(ex, response);
  //       return;
  //       // // look for a particular error structure and return
  //       // // otherwise return a 500
  //       // self.sendError(response, { statusCode: 500, message: 'Unknown error' });
  //     }
  //   };
  // }

  // private sendError(response: any, error: ErrorMessage) {
  //   // This needs to manage more than just express in the future
  //   // add middleware hook to manage sending a response
  //   response.status(error.statusCode).send(error);
  // }

  private static handleRouteError(
    ex: any,
    sendResponse: SendResponse,
    custom404?: boolean
  ) {
    switch (ex.name) {
      case 'RotiroErrorResponse':
        // status or 500
        const responseError: RotiroErrorResponse = ex;

        // TODO Set content type correctly
        sendResponse(
          responseError.status,
          responseError.content ||
            responseError.message ||
            HttpErrors[responseError.status] ||
            'Api Error',
          'text/plain'
        );

        // response
        //   .status(responseError.status)
        //   .send(
        //     responseError.content ||
        //       responseError.message ||
        //       HttpErrors[responseError.status] ||
        //       'Api Error'
        //   );

        return;
      case 'RotiroError':
        if (!custom404 && ex.errorCode === 'E101') {
          // create a 404 response
          sendResponse(404, HttpErrors[404], 'text/plain');
          //response.status(404).send('Not Found');
          return;
        }
        sendResponse(500, HttpErrors[500], 'text/plain');
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
