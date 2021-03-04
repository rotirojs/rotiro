// import { Request, Response } from "express";
// import { createRequest } from "../services/create-request";
import { sendResponse } from "../services/send-response";
import {
  ApiRequest,
  AuthenticatorFunc,
  ErrorMessage,
  RestMethods
} from "../type-defs";
import { cleanBasePath, trimString } from "../utils";
import { Authenticators } from "./authenticators";
import { Controllers } from "./controllers";
import { Endpoints } from "./endpoints";
import { Mappers } from "./mappers";
import { Routes } from "./routes";
import {createRequest} from '../services/create-request';

export class Api {
  public get controllers(): Controllers {
    return this._controllers;
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

  public static create(basePath?: string): Api {
    return new Api(basePath || "");
  }

  // seperate the reading of the request so that it can be replaced by middleware later
  // to handle alternatives to express
  private static extractRequestDetails(
    request: any,
    basePath: string
  ): { method: RestMethods; body: any; fullPath: string } {
    if (!request.originalUrl || !request.method) {
      throw new Error("Original request not valid");
    }

    let fullPath = cleanBasePath(request.originalUrl);

    if (basePath.length) {
      // remove the base path from the original url
      fullPath = fullPath.substr(basePath.length);
    }
    const method: RestMethods = request.method.toUpperCase() as RestMethods;
    const body: object = ["PUT", "PATCH", "POST"].includes(method)
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
  private _locked: boolean = false;

  private constructor(basePath: string) {
    this.basePath = cleanBasePath(basePath);

    this._authenticators = new Authenticators();
    this._endpoints = new Endpoints();
    this._controllers = new Controllers();
    this._mappers = new Mappers();
    this._routes = new Routes(this._endpoints, this._controllers);
  }

  public build(): void {
    // check any endpoints have controllers
    // prevent any updates to controller etc

    const endpointNames = this._endpoints.getRoutesAndMethods();
    const controllerErrors: string[] = this._controllers.validateControllers(
      endpointNames
    );

    if (controllerErrors.length) {
      const errorMessage: string = `Not all endpoints have a controller (${controllerErrors.join(
        ", "
      )})`;
      throw new Error(errorMessage);
    }

    const authTokens: string[] = this._endpoints.getAuthTokenNames();
    if (authTokens.length) {
      // validate they all exists
      const authenticatorErrors = this.authenticators.validateAuthenticators(
        authTokens
      );
      if (authenticatorErrors.length) {
        const errorMessage: string = `One or more auth tokens to not have a handler (${authenticatorErrors.join(
          ", "
        )})`;
        throw new Error(errorMessage);
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
        throw new Error("Api not built");
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

      const apiRequest = createRequest(
        fullPath,
        method,
        this.endpoints,
        this.mappers,
        body
      );

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
            message: "Unauthorized"
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
        self.sendError(response, { statusCode: 500, message: "Unknown error" });
      }
    };
  }

  // public sendResponse(
  //   apiRequest: ApiRequest,
  //   body: any,
  //   status: number = 200,
  //   contentType?: string
  // ) {
  //   sendResponse(apiRequest, body, status, contentType);
  // }

  private sendError(response: Response, error: ErrorMessage) {
    // This needs to manage more than just express in the future
    // add middleware hook to manage sending a response
    response.status(error.statusCode).send(error);
  }
}
