import {RequestDetail, RotiroMiddleware} from '../../type-defs';

export class ExpressResponse implements RotiroMiddleware {
  private readonly _requestDetail: RequestDetail;

  constructor(private readonly request, private readonly response) {
    const headers: Record<string, string> = {};
    // TODO add the headers
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

  sendResponse(status: number, body: any, contentType?: string) {
    this.response.type(contentType || 'text/plain');
    this.response.status(status).send(String(body));
  }
}
