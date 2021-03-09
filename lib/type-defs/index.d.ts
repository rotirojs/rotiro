export declare type RestMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
export interface ApiRequest {
    routeName: string;
    pathPattern: string;
    authTokenName?: string;
    path: string;
    method: RestMethods;
    valid: boolean;
    authenticated: boolean;
    auth?: any;
    pathParams: Record<string, ApiRequestParam>;
    bodyParams: Record<string, ApiRequestParam>;
    queryParams: Record<string, ApiRequestParam>;
    rawBody: any;
    rawQuery: string;
    request?: any;
    response?: any;
    sendResponse: (apiRequest: ApiRequest, body: any, status?: number, contentType?: string) => void;
}
export interface ApiResponse {
    sendError: (status: number, message: string, data: any) => void;
    sendJSON: (payload: object, status?: number) => void;
    response: any;
}
export interface ApiRequestParam {
    name: string;
    value: any | any[];
    valid: boolean;
    type: string;
}
export interface RouteNamePattern {
    routeName: string;
    pattern: any;
}
export declare type ControlerFunc = (apiRequest: ApiRequest) => void;
export declare type AuthenticatorFunc = (apiRequest: ApiRequest) => Promise<boolean>;
export declare type DataMapperFunc = (data: any | any[]) => any | any[];
export interface ApiEndpointSchema extends RouteNamePattern {
    path: string;
    pathParams?: PathSchemaParam[];
    methods: Record<RestMethods, MethodSchema>;
}
export interface MethodSchema {
    auth?: string;
    bodyParams?: MethodSchemaParam[];
    queryParams?: MethodSchemaParam[];
}
export interface PathSchemaParam {
    type: string;
    name: string;
}
export interface MethodSchemaParam extends PathSchemaParam {
    array?: boolean;
    optional?: boolean;
    value?: any;
}
export interface ErrorMessage {
    statusCode: number;
    message: string;
    errorId?: string;
    errorBody?: any;
}
export interface RouteConfig {
    path?: Record<string, string | RoutePathParameter>;
    methods: Record<string | RestMethods, RouteMethod>;
    meta?: RouteMeta;
}
export interface RoutePathParameter {
    type: string;
}
export interface RouteMethod {
    auth?: string;
    body?: Record<string, RouteParameter>;
    query?: Record<string, RouteParameter>;
    controller: ControlerFunc;
    meta?: RouteMeta;
}
export interface RouteParameter {
    type: string;
    array?: boolean;
    optional?: boolean;
    meta?: RouteMeta;
}
export interface RouteMeta {
    name: string;
    description: string;
}
export interface ApiOptions {
    custom404?: boolean;
    basePath?: string;
}
//# sourceMappingURL=index.d.ts.map