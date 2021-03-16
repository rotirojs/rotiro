export declare class RotiroError extends Error {
    readonly errorCode: string | undefined;
    readonly content: any | undefined;
    constructor(message: string, content?: any, errorCode?: string);
    get name(): string;
}
//# sourceMappingURL=rotiro-error.d.ts.map