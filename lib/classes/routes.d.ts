import { RouteConfig } from '../type-defs';
import { Controllers } from './controllers';
import { Endpoints } from './endpoints';
export declare class Routes {
    private readonly endpoints;
    private readonly controllers;
    get locked(): boolean;
    private _locked;
    constructor(endpoints: Endpoints, controllers: Controllers);
    lock(): void;
    add(name: string, path: string, config: RouteConfig): void;
}
//# sourceMappingURL=routes.d.ts.map