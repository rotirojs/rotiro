"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressResponse = void 0;
class ExpressResponse {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        const headers = {};
        if (request.headers) {
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
    get requestDetail() {
        return this._requestDetail;
    }
    sendResponse(body, status, contentType) {
        this.response.type(contentType || 'text/plain');
        this.response.status(status || 200).send(String(body));
    }
}
exports.ExpressResponse = ExpressResponse;
//# sourceMappingURL=express-response.js.map