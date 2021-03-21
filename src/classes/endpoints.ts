import { pathToRegexp } from 'path-to-regexp';
import { createError, ErrorCodes } from '../errors/error-codes';
import {
  ApiEndpointSchema,
  MethodSchema,
  PathSchemaParam,
  RestMethods,
  RouteNamePattern
} from '../type-defs';
import { sanitisePath, trimString } from '../utils';
import { areListsEqual } from '../utils/arrays';

export class Endpoints {
  public get locked(): boolean {
    return this._locked;
  }
  private readonly endpoints: Record<string, ApiEndpointSchema>;
  private readonly paths: Record<string, string>;

  private _locked: boolean = false;

  constructor() {
    this.endpoints = {};
    this.paths = {};
  }

  public lock(): void {
    this._locked = true;
  }

  public getRoutesAndMethods(): Array<{
    routeName: string;
    methods: string[];
  }> {
    const routesAndMethods: Array<{
      routeName: string;
      methods: string[];
    }> = [];

    Object.values(this.endpoints).forEach((endpoint: ApiEndpointSchema) => {
      routesAndMethods.push({
        routeName: endpoint.routeName,
        methods: Object.keys(endpoint.methods)
      });
    });

    return routesAndMethods;
  }

  public getAuthTokenNames(): string[] {
    const authTokenNames: Record<string, string> = {};
    Object.values(this.endpoints).forEach((endpoint: ApiEndpointSchema) => {
      Object.values(endpoint.methods).forEach((schema: MethodSchema) => {
        const auth: string = trimString(schema.auth || '');
        if (auth) {
          authTokenNames[auth] = auth;
        }
      });
    });

    return Object.values(authTokenNames);
  }

  public getRoutePatterns(): RouteNamePattern[] {
    return Object.values(this.endpoints).map((value: ApiEndpointSchema) => {
      return { routeName: value.routeName, pattern: value.pattern };
    });
  }

  public get(name: string): ApiEndpointSchema {
    if (!this.endpoints[name]) {
      throw createError(ErrorCodes.PathNotFound);
    }
    return this.endpoints[name];
  }

  public add(
    name: string,
    path: string,
    methods: RestMethods[] | Record<string, MethodSchema>,
    pathParams: PathSchemaParam[] = []
  ): ApiEndpointSchema {
    if (this.locked) {
      throw createError(ErrorCodes.ApiLocked);
    }

    const routeName: string = trimString(name);

    if (!routeName.length) {
      throw createError(ErrorCodes.InvalidRouteName);
    }
    if (this.endpoints[routeName]) {
      throw createError(ErrorCodes.RouteNameAlreadyAdded);
    }

    const routePath = sanitisePath(path);

    const keys: any[] = [];
    const pattern = pathToRegexp(routePath, keys);
    const keyList: string[] = keys.map((key: any) => {
      return key.name;
    });

    if (
      !areListsEqual(
        keyList,
        pathParams.map((pathParam: PathSchemaParam) => {
          return pathParam.name;
        })
      )
    ) {
      throw createError(ErrorCodes.InvalidPathParams);
    }

    if (!routePath.length) {
      throw createError(ErrorCodes.InvalidPath);
    }
    if (this.paths[routePath]) {
      throw createError(ErrorCodes.PathAlreadyAdded);
    }

    let endpointMethods: Record<string, MethodSchema>;

    if (Array.isArray(methods)) {
      endpointMethods = {} as any;
      for (const method of methods) {
        endpointMethods[method] = {};
      }
    } else {
      endpointMethods = { ...methods };
    }

    const endpoint: ApiEndpointSchema = {
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
