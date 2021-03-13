import {RequestDetail, RotiroMiddleware} from '../../type-defs';
import {Api} from '../../classes';

// define api
// build api
// create middleware and pass api to it
// register middleware

export function router(api: Api) {
  return async (request: any, response: any) => {
    const expressResponse: RotiroMiddleware = new ExpressResponse(
      request,
      response
    );
    Api.handleRequest(api, expressResponse);
  };
}

class ExpressResponse implements RotiroMiddleware {
  private readonly _requestDetail: RequestDetail;

  constructor(private readonly request, private readonly response) {
    const headers: Record<string, string> = {};
    this._requestDetail = {
      method: request.method,
      url: request.originalUrl,
      body: request.body,
      headers
    };
  }

  public get requestDetail(): RequestDetail {
    return this._requestDetail;
  }

  sendResponse(status: number, body: any, contentType: string) {
    this.response.type(contentType || 'text/plain');
    this.response.status(status).send(String(body));
  }
}

//
// class ExpressMiddleware implements RotiroMiddleware {
//   constructor(private readonly request: any, private readonly response: any) {}
//
//   extractRequestDetail(): RequestDetail {
//     const headers: Record<string, string> = {};
//
//     const commonRequest: RequestDetail = {
//       method: this.request.method,
//       url: this.request.originalUrl,
//       body: this.request.body,
//       headers
//     };
//
//     return commonRequest;
//   }
//
//   sendResponse(status: number, body: any, contentType: string) {
//     this.response.type(contentType || 'text/plain');
//     this.response.status(status).send(String(body));
//   }
//
//   public router() {
//     const self = this;
//     return async (request: any, response: any) => {
//       if (!self.locked) {
//         throw createError(ErrorCodes.E102);
//       }
//
//       const {
//         method,
//         body,
//         fullPath
//       }: {
//         method: RestMethods;
//         body: any;
//         fullPath: string;
//       } = Api.extractRequestDetails(request, this.basePath);
//
//       let apiRequest: ApiRequest;
//       try {
//         apiRequest = createRequest(
//           fullPath,
//           method,
//           this.endpoints,
//           this.mappers,
//           body
//         );
//       } catch (ex) {
//         this.handleRouteError(ex, response);
//         return;
//       }
//
//       apiRequest.request = request;
//       apiRequest.response = response;
//
//       if (apiRequest.authTokenName) {
//         // call authenticator
//         const authenticator: AuthenticatorFunc = this.authenticators.get(
//           apiRequest.authTokenName
//         );
//         apiRequest.authenticated = await authenticator(apiRequest);
//         if (!apiRequest.authenticated) {
//           // throw an error
//           return self.sendError(response, {
//             statusCode: 401,
//             message: 'Unauthorized'
//           });
//         }
//       }
//       const func = self.controllers.get(apiRequest.routeName, method);
//
//       // update the request and response object before passing it in
//
//       try {
//         // test auth
//         func.call(self, apiRequest);
//       } catch (ex) {
//         this.handleRouteError(ex, response);
//         return;
//         // // look for a particular error structure and return
//         // // otherwise return a 500
//         // self.sendError(response, { statusCode: 500, message: 'Unknown error' });
//       }
//     };
//   }
// }
//
// interface RotiroMiddleware {
//   // extractRequestDetail: () => RequestDetail;
//   sendResponse: (status: number, body: any, contentType: string) => void;
// }
//
// interface RequestDetail {
//   method: string;
//   url: string;
//   body: string;
//   headers: Record<string, string>;
// }
