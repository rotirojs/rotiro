"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponseDetail = void 0;
function getResponseDetail(body, status = 200, contentType) {
    if (body === null || typeof body === 'undefined') {
        body = '';
    }
    const responseDetail = {
        body,
        statusCode: status,
        contentType: contentType || ''
    };
    if (typeof body === 'object') {
        try {
            responseDetail.body = JSON.stringify(body);
            responseDetail.contentType = contentType || 'application/json';
        }
        catch (ex) {
            responseDetail.contentType = 'text/plain';
            responseDetail.statusCode = 500;
            responseDetail.body = 'Error parsing object';
        }
    }
    else if (typeof body === 'string') {
        if (!contentType && body.includes('<html')) {
            contentType = 'text/html';
        }
        responseDetail.contentType = contentType || 'text/plain';
    }
    else {
        responseDetail.contentType = contentType || 'text/plain';
    }
    return responseDetail;
}
exports.getResponseDetail = getResponseDetail;
//# sourceMappingURL=get-response-detail.js.map