import { ApiOptions, RotiroMiddleware } from '../type-defs';
import { Authenticators } from './authenticators';
import { Controllers } from './controllers';
import { Endpoints } from './endpoints';
import { Mappers } from './mappers';
import { Routes } from './routes';
export declare class Api {
    get controllers(): Controllers;
    get routes(): Routes;
    get endpoints(): Endpoints;
    get mappers(): Mappers;
    get authenticators(): Authenticators;
    get locked(): boolean;
    static handleRequest(api: Api, middleware: RotiroMiddleware): Promise<void>;
    private static handleRouteError;
    private readonly _routes;
    private readonly _authenticators;
    private readonly _endpoints;
    private readonly _controllers;
    private readonly _mappers;
    private readonly basePath;
    private readonly options;
    private _locked;
    constructor(options?: ApiOptions);
    build(): void;
}
//# sourceMappingURL=api.d.ts.map