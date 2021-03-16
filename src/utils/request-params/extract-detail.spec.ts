import { createError, ErrorCodes } from '../../errors/error-codes';
import { RequestDetail } from '../../type-defs';
import { ExtractedRequestDetail } from '../../type-defs/internal';
import { extractRequestDetails } from './extract-detail';

describe('utils/request-params/extract-detail', () => {
  let requestDetail: RequestDetail;
  beforeEach(() => {
    requestDetail = {
      url: '/',
      headers: {},
      method: 'GET'
    };
  });

  it('Throws error if no method', () => {
    requestDetail.method = '';
    let error: any;
    try {
      extractRequestDetails(requestDetail, '');
    } catch (ex) {
      error = ex;
    }
    expect(error).toEqual(createError(ErrorCodes.E103));
  });

  it('Throws error if no url', () => {
    requestDetail.url = '';
    let error: any;
    try {
      extractRequestDetails(requestDetail, '');
    } catch (ex) {
      error = ex;
    }
    expect(error).toEqual(createError(ErrorCodes.E103));
  });

  it('Return a slash where url is /', () => {
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      ''
    );
    expect(response.fullPath).toEqual('/');
  });

  it('Removes base path from the url', () => {
    requestDetail.url = '/api-base/ping';
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      '/api-base'
    );
    expect(response.fullPath).toEqual('/ping');
  });

  it('Set full path to / if same as base path', () => {
    requestDetail.url = '/api-base';
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      '/api-base'
    );
    expect(response.fullPath).toEqual('/');
  });

  it('Return body if POST', () => {
    const body: any = { name: 'bob' };
    requestDetail.body = body;
    requestDetail.method = 'POST';
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      ''
    );
    expect(response.body).toEqual(body);
  });

  it('Return body if PUT', () => {
    const body: any = { name: 'bob' };
    requestDetail.body = body;
    requestDetail.method = 'PUT';
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      ''
    );
    expect(response.body).toEqual(body);
  });

  it('Return body if PATCH', () => {
    const body: any = { name: 'bob' };
    requestDetail.body = body;
    requestDetail.method = 'PATCH';
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      ''
    );
    expect(response.body).toEqual(body);
  });

  it('Return empty body if GET', () => {
    const body: any = { name: 'bob' };
    requestDetail.body = body;
    requestDetail.method = 'GET';
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      ''
    );
    expect(response.body).toEqual({});
  });

  it('Return empty body if DELETE', () => {
    const body: any = { name: 'bob' };
    requestDetail.body = body;
    requestDetail.method = 'DELETE';
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      ''
    );
    expect(response.body).toEqual({});
  });

  it('Return empty body if POST and no body provided', () => {
    requestDetail.method = 'POST';
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      ''
    );
    expect(response.body).toEqual({});
  });

  it('Return all data from a request', () => {
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      ''
    );
    expect(response).toEqual({
      body: {},
      method: 'GET',
      fullPath: '/',
      headers: {}
    });
  });

  it('Return all data from a request', () => {
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      ''
    );
    expect(response).toEqual({
      body: {},
      method: 'GET',
      fullPath: '/',
      headers: {}
    });
  });

  it('Return all data from a request without headers', () => {
    requestDetail.headers = undefined as any;
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      ''
    );
    expect(response).toEqual({
      body: {},
      method: 'GET',
      fullPath: '/',
      headers: {}
    });
  });

  it('Ignore none matching base path', () => {
    const response: ExtractedRequestDetail = extractRequestDetails(
      requestDetail,
      '/a-different-base-page'
    );
    expect(response).toEqual({
      body: {},
      method: 'GET',
      fullPath: '/',
      headers: {}
    });
  });
});
