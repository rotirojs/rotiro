export type RestMethods = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export interface ApiRequest {
  routeName: string; // name of matched endpoint
  pathPattern: string; // pattern path matched to
  authTokenName?: string; // optional token name
  path: string; // path e.g. /user/334343
  method: RestMethods; // GET etc
  valid: boolean; // is request valid e.g. all params have passed
  authenticated: boolean; // Is the request authenticated or not
  auth?: any; // auth details - probably going to be generic e.g. include user stuff
  pathParams: Record<string, ApiRequestParam>;
  bodyParams: Record<string, ApiRequestParam>;
  queryParams: Record<string, ApiRequestParam>;
  body: any; // raw body - assume json for now
  query: string; // query string after ? e.g. test=case&some=other
  request?: any; // express request
  response?: any;
  sendResponse: (
    apiRequest: ApiRequest,
    body: any,
    status?: number,
    contentType?: string
  ) => void;
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

export type ControlerFunc = (apiRequest: ApiRequest) => void;

export type AuthenticatorFunc = (apiRequest: ApiRequest) => Promise<boolean>;

export type DataMapperFunc = (data: any | any[]) => any | any[];

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
  statusCode: number; // http status code e.g. 403, 404
  message: string; // A friendly message that can be displayed on the front end
  errorId?: string; // Consistent code that can identify the type of error
  errorBody?: any; // Additional data that can be used by the front end to describe the error
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
