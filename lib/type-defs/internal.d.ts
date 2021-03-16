import { RestMethods } from './index';
export interface ExtractedRequestDetail {
    method: RestMethods;
    body: any;
    fullPath: string;
    headers: Record<string, string>;
}
export interface ResponseDetail {
    body: string;
    statusCode: number;
    contentType: string;
}
//# sourceMappingURL=internal.d.ts.map