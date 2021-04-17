import { RotiroErrorResponse } from '../errors';
import {
  createError,
  ErrorCodes,
  RotiroErrorCode
} from '../errors/error-codes';
import { HttpErrors } from '../errors/http-error-codes';
import { createRequest } from '../services/create-request';
import { getResponseDetail } from '../services/get-response-detail';
import { logger } from '../services/logger';
import {
  ApiOptions,
  ApiRequest,
  AuthenticatorFunc,
  RequestDetail,
  RotiroMiddleware,
  SendResponse
} from '../type-defs';
import { ExtractedRequestDetail, ResponseDetail } from '../type-defs/internal';
import { cleanBasePath } from '../utils';
import { getAuthToken } from '../utils/auth-token';
import { extractRequestDetails } from '../utils/request-params/extract-detail';
import { Authenticators } from './authenticators';
import { Controllers } from './controllers';
import { Endpoints } from './endpoints';
import { Mappers } from './mappers';
import { Routes } from './routes';

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

  public static async handleRequest(
    api: Api,
    middleware: RotiroMiddleware
  ): Promise<void> {
    const requestDetail: RequestDetail = middleware.requestDetail;

    logger.debug(`url: ${requestDetail.url}`);
    logger.debug(`method: ${requestDetail.method}`);
    if (!requestDetail.url || !requestDetail.method) {
      logger.error('Original request not valid');
      throw createError(ErrorCodes.OriginalRequestNotValid);
    }

    const {
      method,
      body,
      fullPath,
      headers ,
      meta,
      originalRequest
    }: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      api.basePath
    );

    logger.debug(`Extracted method: ${method}`);
    logger.display('Extracted body', body);
    logger.debug(`Extracted fullPath: ${fullPath}`);
    logger.display('Extracted headers', headers);

    let apiRequest: ApiRequest;
    try {
      apiRequest = createRequest(
        fullPath,
        method,
        api.endpoints,
        api.mappers,
        body,
        headers
      );
      apiRequest.originalRequest = originalRequest;
      applyMeta(apiRequest, meta);
      logger.display('Api Request', apiRequest);
    } catch (ex) {
      logger.error(`Create request error: ${ex}`);
      Api.handleRouteError(
        ex,
        middleware.sendResponse.bind(middleware),
        api.options.custom404
      );
      return;
    }

    if (apiRequest.authTokenName) {
      logger.debug(
        `Requesting auth handler based on ${apiRequest.authTokenName}`
      );
      // call authenticator
      const authenticator: AuthenticatorFunc = api.authenticators.get(
        apiRequest.authTokenName
      );
      logger.debug(`Requesting auth token value from headers or query`);
      apiRequest.authTokenValue = getAuthToken(
        apiRequest.authTokenName,
        apiRequest.headers,
        apiRequest.query
      );
      apiRequest.authenticated = await authenticator(apiRequest);
      if (!apiRequest.authenticated) {
        // throw an error
        logger.error('Authentication failed');
        middleware.sendResponse(HttpErrors[401], 401, 'text/plain');
      }
    }

    logger.debug(
      `Loading controller based on ${apiRequest.routeName} and ${method}`
    );
    const func = api.controllers.get(apiRequest.routeName, method);

    try {
      apiRequest.send = (
        bodyContent: any,
        status: number,
        contentType: string,
        cleanHeaders: Record<string, string>
      ) => {
        const responseDetail: ResponseDetail = getResponseDetail(
          bodyContent,
          status,
          contentType,
          cleanHeaders
        );
        logger.display('Response Detail', responseDetail);
        logger.debug('Sending the body response back to browser');
        middleware.sendResponse(
          responseDetail.body,
          responseDetail.statusCode,
          responseDetail.contentType,
          responseDetail.headers
        );
      };

      logger.debug('Calling controller function');
      await func.call(undefined, apiRequest);
    } catch (ex) {
      logger.error(`Error occurred calling controller ${ex}`);
      Api.handleRouteError(
        ex,
        middleware.sendResponse.bind(middleware),
        api.options.custom404
      );
      return;
    }
  }

  private static handleRouteError(
    ex: any,
    sendResponse: SendResponse,
    custom404?: boolean
  ) {
    switch (ex.name) {
      case 'RotiroErrorResponse':
        // status or 500
        const responseError: RotiroErrorResponse = ex;
        logger.error(
          `Sending RotiroErrorResponse with status ${responseError.status}`
        );
        // TODO Set content type correctly
        sendResponse(
          responseError.content ||
            responseError.message ||
            HttpErrors[responseError.status] ||
            'Api Error',
          responseError.status,
          'text/plain'
        );

        return;
      case 'RotiroError':
        logger.error(`Handling error code ${ex.errorCode}`);
        if (ex.errorCode === RotiroErrorCode.PathNotFound.toString()) {
          if (!custom404) {
            logger.error(`Sending RotiroError with status 404`);
            sendResponse(HttpErrors[404], 404, 'text/plain');
            return;
          } else {
            logger.error(`Throwing RotiroError as custom404`);
            throw ex;
          }
        }

        logger.error(`Sending 500 error`);
        sendResponse(ex.message || HttpErrors[500], 500, 'text/plain');
        return;
    }
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
      throw createError(ErrorCodes.ControllerMissing, controllerErrors);
    }

    const authTokens: string[] = this._endpoints.getAuthTokenNames();
    if (authTokens.length) {
      // validate they all exists
      const authenticatorErrors = this.authenticators.validateAuthenticators(
        authTokens
      );
      if (authenticatorErrors.length) {
        throw createError(ErrorCodes.UnassignedAuthToken, authenticatorErrors);
      }
    }

    this._authenticators.lock();
    this._endpoints.lock();
    this._controllers.lock();
    this._mappers.lock();
    this._locked = true;
  }
}

function applyMeta(apiRequest: ApiRequest, meta: any): void {
  if (meta && typeof meta === 'object') {
    const keys: string[] = Object.keys(meta);
    if (keys.length) {
      for (const key of keys) {
        apiRequest.meta[key] = meta[key];
      }
    }
  }
}
