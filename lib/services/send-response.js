"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
function sendResponse(apiRequest, body, status = 200, contentType) {
    if (body === null || typeof body === 'undefined') {
        body = '';
    }
    if (typeof body === 'object') {
        try {
            const jsonBody = JSON.stringify(body);
            apiRequest.response.type(contentType || 'application/json');
            apiRequest.response.status(status).send(jsonBody);
        }
        catch (ex) {
            apiRequest.response.type(contentType || 'text/plain');
            apiRequest.response.status(500).send('Error parsing object');
        }
    }
    else if (typeof body === 'string') {
        if (!contentType && body.includes('<html')) {
            contentType = 'text/html';
        }
        apiRequest.response.type(contentType || 'text/plain');
        apiRequest.response.status(status).send(body);
    }
    else {
        apiRequest.response.type(contentType || 'text/plain');
        apiRequest.response.status(status).send(String(body));
    }
}
exports.sendResponse = sendResponse;
//# sourceMappingURL=send-response.js.map