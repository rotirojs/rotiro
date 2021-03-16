import { RotiroError } from './rotiro-error';
export declare class RotiroErrorResponse extends RotiroError {
    readonly status: number;
    constructor(message: string, status: number, content?: any, errorCode?: string);
    get name(): string;
}
//# sourceMappingURL=rotiro-error-response.d.ts.map