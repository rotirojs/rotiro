import { Api } from '../../classes';
import { RotiroMiddleware } from '../../type-defs';
import { ExpressResponse } from './express-response';

export function router(api: Api) {
  return async (request: any, response: any) => {
    const expressResponse: RotiroMiddleware = new ExpressResponse(
      request,
      response
    );
    Api.handleRequest(api, expressResponse);
  };
}
