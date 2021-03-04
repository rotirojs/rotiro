import { ApiEndpointSchema, MethodSchema, PathSchemaParam, RestMethods, RouteNamePattern } from '../type-defs';
export declare class Endpoints {
    get locked(): boolean;
    private readonly endpoints;
    private readonly paths;
    private _locked;
    constructor();
    lock(): void;
    getRoutesAndMethods(): Array<{
        routeName: string;
        methods: string[];
    }>;
    getAuthTokenNames(): string[];
    getRoutePatterns(): RouteNamePattern[];
    get(name: string): ApiEndpointSchema;
    add(name: string, path: string, methods: RestMethods[] | Record<string, MethodSchema>, pathParams?: PathSchemaParam[]): ApiEndpointSchema;
}
//# sourceMappingURL=endpoints.d.ts.map