import { ResponseDetail } from '../type-defs/internal';
import { cleanHeaders } from '../utils/request-params/extract-detail';

export function getResponseDetail(
  body: any,
  status: number = 200,
  contentType?: string,
  headers?: Record<string, string>
): ResponseDetail {
  if (body === null || typeof body === 'undefined') {
    body = '';
  }
  const responseDetail: ResponseDetail = {
    body,
    statusCode: status,
    contentType: contentType || '',
    headers: cleanHeaders(headers)
  };

  if (typeof body === 'object') {
    try {
      responseDetail.body = JSON.stringify(body);
      responseDetail.contentType = contentType || 'application/json';
    } catch (ex) {
      responseDetail.contentType = 'text/plain';
      responseDetail.statusCode = 500;
      responseDetail.body = 'Error parsing object';
    }
  } else if (typeof body === 'string') {
    if (!contentType && body.includes('<html')) {
      contentType = 'text/html';
    }
    responseDetail.contentType = contentType || 'text/plain';
  } else {
    responseDetail.contentType = contentType || 'text/plain';
  }

  // if no contentType was set then check the headers and copy the
  // contentType over
  if (!contentType && responseDetail.headers.contenttype) {
    responseDetail.contentType = responseDetail.headers.contenttype;
  }

  return responseDetail;
}
