import {
  MethodSchema,
  PathSchemaParam,
  RestMethods,
  RouteConfig,
  RouteMethod,
  RoutePathParameter
} from '../type-defs';
import { assignBodyParam } from '../utils/request-params';
import { Controllers } from './controllers';
import { Endpoints } from './endpoints';

export class Routes {
  public get locked(): boolean {
    return this._locked;
  }

  private _locked: boolean = false;
  constructor(
    private readonly endpoints: Endpoints,
    private readonly controllers: Controllers
  ) {}

  public lock(): void {
    this._locked = true;
  }

  public add(name: string, path: string, config: RouteConfig) {
    if (this.locked) {
      throw new Error('Api is locked and cannot be updated');
    }

    const pathParams: PathSchemaParam[] = [];

    if (config.path) {
      for (const key of Object.keys(config.path)) {
        let pathParamType: string;
        if (typeof config.path[key] === 'string') {
          pathParamType = config.path[key] as string;
        } else {
          pathParamType = (config.path[key] as RoutePathParameter).type;
        }

        pathParams.push({ name: key, type: pathParamType });
      }
    }

    const methods: Record<string, MethodSchema> = {};

    const supportedMethods = Object.keys(config.methods);
    if (!supportedMethods.length) {
      throw new Error('No methods defined');
    }

    for (const method of supportedMethods) {
      const routeMethod: RouteMethod = config.methods[method];
      const methodConfig: MethodSchema = {};
      if (routeMethod.auth) {
        methodConfig.auth = routeMethod.auth;
      }

      if (routeMethod.body) {
        methodConfig.bodyParams = assignBodyParam(routeMethod.body);
      }

      if (routeMethod.query) {
        methodConfig.queryParams = assignBodyParam(routeMethod.query);
      }
      methods[method] = methodConfig;
      this.controllers.add(name, method as RestMethods, routeMethod.controller);
    }

    this.endpoints.add(name, path, methods, pathParams);
  }
}
