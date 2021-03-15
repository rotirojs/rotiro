import { RequestDetail, RotiroMiddleware } from '../../type-defs';

export class ExpressResponse implements RotiroMiddleware {
  private readonly _requestDetail: RequestDetail;

  constructor(private readonly request, private readonly response) {
    const headers: Record<string, string> = {};

    if (request.headers) {
      // copy the headers over and make all keys lower case
      for (const header of Object.keys(request.headers)) {
        headers[header.toLowerCase()] = request.headers[header];
      }
    }

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

  public sendResponse(status: number, body: any, contentType?: string) {
    this.response.type(contentType || 'text/plain');
    this.response.status(status).send(String(body));
  }
}
