import { RotiroError } from './rotiro-error';
export declare enum ErrorCodes {
    E101 = 0,
    E102 = 1,
    E103 = 2,
    E104 = 3,
    E105 = 4,
    E106 = 5,
    E107 = 6,
    E108 = 7,
    E109 = 8,
    E110 = 9,
    E111 = 10,
    E112 = 11,
    E113 = 12,
    E114 = 13,
    E115 = 14,
    E116 = 15,
    E117 = 16,
    E118 = 17
}
export declare function createError(errorCode: ErrorCodes, content?: any): RotiroError;
//# sourceMappingURL=error-codes.d.ts.map