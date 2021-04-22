import { ApiResponse } from '../type-defs';
import { extractHeaderParam } from '../utils/header-param';
import { cleanHeaders } from '../utils/request-params/extract-detail';

export function getResponseDetail(
  body: any,
  status: number = 200,
  contentType?: string,
  headers?: Record<string, string>
): ApiResponse {
  if (body === null || typeof body === 'undefined') {
    body = '';
  }
  const responseDetail: ApiResponse = {
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
  const existingContentTypeHeaderValue: string = extractHeaderParam(
    'Content-Type',
    responseDetail.headers
  ) as string;

  if (!contentType && existingContentTypeHeaderValue) {
    responseDetail.contentType = existingContentTypeHeaderValue;
  }

  return responseDetail;
}
