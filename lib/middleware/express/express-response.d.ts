import { RequestDetail, RotiroMiddleware } from '../../type-defs';
export declare class ExpressResponse implements RotiroMiddleware {
    private readonly request;
    private readonly response;
    private readonly _requestDetail;
    constructor(request: any, response: any);
    get requestDetail(): RequestDetail;
    sendResponse(status: number, body: any, contentType?: string): void;
}
//# sourceMappingURL=express-response.d.ts.map