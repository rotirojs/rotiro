import { RequestDetail } from '../../type-defs';
import { ExpressResponse } from './express-response';

describe('middleware/express/express-response', () => {
  let request: any;
  let response: any;
  let sendMock: any;
  let expressResponse: ExpressResponse;

  beforeEach(() => {
    request = {
      method: 'GET',
      originalUrl: '/ping'
    };

    sendMock = jest.fn();
    response = { type: jest.fn() };
    response.status = jest.fn().mockReturnValue({
      send: sendMock
    });

    expressResponse = new ExpressResponse(request, response);
  });

  it('Displays request detail', () => {
    const requestDetail: RequestDetail = expressResponse.requestDetail;
    expect(requestDetail.method).toEqual('GET');
    expect(requestDetail.url).toEqual('/ping');
  });

  it('Maps headers from request to request detail', () => {
    request.headers = { Authorization: 'asdf' };
    expressResponse = new ExpressResponse(request, response);
    const requestDetail: RequestDetail = expressResponse.requestDetail;

    expect(requestDetail.headers).toEqual({ authorization: 'asdf' });
  });

  it('Calls the response on express', () => {
    expressResponse.sendResponse('A message', 403, 'text/html');
    expect(response.type).toBeCalledWith('text/html');
    expect(response.status).toBeCalledWith(403);
    expect(sendMock).toBeCalledWith('A message');
  });

  it('Calls the response on express with default content type', () => {
    expressResponse.sendResponse('A message', 403);
    expect(response.type).toBeCalledWith('text/plain');
  });

  it('Calls the response on express with default status', () => {
    expressResponse.sendResponse('A message');
    expect(response.status).toBeCalledWith(200);
  });

  it('Return a body object from the request', () => {
    const body: any = { name: 'body' };
    request.body = body;
    expressResponse = new ExpressResponse(request, response);
    const requestDetail: RequestDetail = expressResponse.requestDetail;
    expect(requestDetail.body).toEqual(body);
  });
});
