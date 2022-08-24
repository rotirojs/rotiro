import { createError, ErrorCodes } from '../errors/error-codes';
import { ControllerFunc, RestMethods } from '../type-defs';

export class Controllers {
  private controllers: Record<string, Record<string, ControllerFunc>> = {};
  private _locked: boolean = false;

  public get locked(): boolean {
    return this._locked;
  }

  public lock(): void {
    this._locked = true;
  }

  public add(
    routeName: string,
    method: RestMethods,
    controller: ControllerFunc
  ) {
    if (this._locked) {
      throw createError(ErrorCodes.ApiLocked);
    }

    if (!this.controllers[routeName]) {
      this.controllers[routeName] = {};
    }
    const controllers = this.controllers[routeName];
    controllers[method] = controller;
  }

  public validateControllers(
    routes: Array<{ routeName: string; methods: string[] }>
  ): string[] {
    const errors: string[] = [];
    for (const route of routes) {
      const controllers = this.controllers[route.routeName];
      if (controllers) {
        for (const method of route.methods) {
          if (typeof controllers[method] === 'undefined') {
            errors.push(`${route.routeName}:${method}`);
          }
        }
      } else {
        for (const method of route.methods) {
          errors.push(`${route.routeName}:${method}`);
        }
      }
    }

    return errors;
  }

  public get(routeName: string, method: RestMethods): ControllerFunc {
    const controllers = this.controllers[routeName];
    if (controllers) {
      return controllers[method];
    }
    throw createError(ErrorCodes.RouteNotSupported);
  }
}
