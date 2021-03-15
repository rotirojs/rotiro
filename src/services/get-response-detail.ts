import { ResponseDetail } from '../type-defs/internal';

export function getResponseDetail(
  body: any,
  status: number = 200,
  contentType?: string
): ResponseDetail {
  if (body === null || typeof body === 'undefined') {
    body = '';
  }
  const responseDetail: ResponseDetail = {
    body,
    statusCode: status,
    contentType: contentType || ''
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
  return responseDetail;
}

// export function sendResponse(
//   apiRequest: ApiRequest,
//   body: any,
//   status: number = 200,
//   contentType?: string
// ) {
//   if (body === null || typeof body === 'undefined') {
//     body = '';
//   }
//
//   if (typeof body === 'object') {
//     try {
//       const jsonBody: string = JSON.stringify(body);
//       apiRequest.response.type(contentType || 'application/json');
//       apiRequest.response.status(status).send(jsonBody);
//     } catch (ex) {
//       apiRequest.response.type(contentType || 'text/plain');
//       apiRequest.response.status(500).send('Error parsing object');
//     }
//   } else if (typeof body === 'string') {
//     if (!contentType && body.includes('<html')) {
//       contentType = 'text/html';
//     }
//     apiRequest.response.type(contentType || 'text/plain');
//     apiRequest.response.status(status).send(body);
//   } else {
//     apiRequest.response.type(contentType || 'text/plain');
//     apiRequest.response.status(status).send(String(body));
//   }
// }
