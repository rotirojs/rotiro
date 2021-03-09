import { ApiOptions } from '../type-defs';
import { Authenticators } from './authenticators';
import { Controllers } from './controllers';
import { Endpoints } from './endpoints';
import { Mappers } from './mappers';
import { Routes } from './routes';
export declare class Api {
    readonly options: ApiOptions;
    private readonly _routes;
    private readonly _authenticators;
    private readonly _endpoints;
    private readonly _controllers;
    private readonly _mappers;
    private readonly basePath;
    private constructor();
    get controllers(): Controllers;
    get routes(): Routes;
    get endpoints(): Endpoints;
    get mappers(): Mappers;
    get authenticators(): Authenticators;
    private _locked;
    get locked(): boolean;
    static create(options?: ApiOptions): Api;
    private static extractRequestDetails;
    build(): void;
    router(): (request: any, response: any) => Promise<void>;
    private sendError;
}
//# sourceMappingURL=api.d.ts.map