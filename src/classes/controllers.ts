import { ControlerFunc, RestMethods } from "../type-defs";

export class Controllers {
  private controllers: Record<string, Record<string, ControlerFunc>> = {};
  private _locked: boolean = false;

  // constructor() {
  //   // ref to endpoints
  // }

  public lock(): void {
    this._locked = true;
  }

  public get locked(): boolean {
    return this._locked;
  }

  public add(
    routeName: string,
    method: RestMethods,
    controller: ControlerFunc
  ) {
    if (this._locked) {
      throw new Error("Api is locked and cannot be updated");
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
          if (typeof controllers[method] === "undefined") {
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

  public get(routeName: string, method: RestMethods): ControlerFunc {
    const controllers = this.controllers[routeName];
    if (controllers) {
      return controllers[method];
    }

    throw new Error("Route not supported");
  }
}
