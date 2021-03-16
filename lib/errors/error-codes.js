"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.ErrorCodes = void 0;
const rotiro_error_1 = require("./rotiro-error");
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["E101"] = 0] = "E101";
    ErrorCodes[ErrorCodes["E102"] = 1] = "E102";
    ErrorCodes[ErrorCodes["E103"] = 2] = "E103";
    ErrorCodes[ErrorCodes["E104"] = 3] = "E104";
    ErrorCodes[ErrorCodes["E105"] = 4] = "E105";
    ErrorCodes[ErrorCodes["E106"] = 5] = "E106";
    ErrorCodes[ErrorCodes["E107"] = 6] = "E107";
    ErrorCodes[ErrorCodes["E108"] = 7] = "E108";
    ErrorCodes[ErrorCodes["E109"] = 8] = "E109";
    ErrorCodes[ErrorCodes["E110"] = 9] = "E110";
    ErrorCodes[ErrorCodes["E111"] = 10] = "E111";
    ErrorCodes[ErrorCodes["E112"] = 11] = "E112";
    ErrorCodes[ErrorCodes["E113"] = 12] = "E113";
    ErrorCodes[ErrorCodes["E114"] = 13] = "E114";
    ErrorCodes[ErrorCodes["E115"] = 14] = "E115";
    ErrorCodes[ErrorCodes["E116"] = 15] = "E116";
    ErrorCodes[ErrorCodes["E117"] = 16] = "E117";
    ErrorCodes[ErrorCodes["E118"] = 17] = "E118";
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
const ErrorMessages = {
    [ErrorCodes.E101]: { code: 101, message: 'Path not found' },
    [ErrorCodes.E102]: { code: 102, message: 'Api not built' },
    [ErrorCodes.E103]: { code: 103, message: 'Original request not valid' },
    [ErrorCodes.E104]: { code: 104, message: 'Controller Error' },
    [ErrorCodes.E105]: {
        code: 105,
        message: 'Api is locked and cannot be updated'
    },
    [ErrorCodes.E106]: { code: 106, message: 'Auth token not supported' },
    [ErrorCodes.E107]: { code: 107, message: 'Route not supported' },
    [ErrorCodes.E108]: { code: 108, message: 'Invalid route name' },
    [ErrorCodes.E109]: { code: 109, message: 'Route name already added' },
    [ErrorCodes.E110]: {
        code: 110,
        message: 'Path parameters do not match schema'
    },
    [ErrorCodes.E111]: { code: 111, message: 'Invalid path' },
    [ErrorCodes.E112]: { code: 112, message: 'Path already added' },
    [ErrorCodes.E113]: { code: 113, message: 'No methods defined' },
    [ErrorCodes.E114]: { code: 114, message: 'Invalid request' },
    [ErrorCodes.E115]: { code: 115, message: 'Invalid token name' },
    [ErrorCodes.E116]: { code: 116, message: 'Invalid parameters' },
    [ErrorCodes.E117]: {
        code: 117,
        message: 'Not all endpoints have a controller'
    },
    [ErrorCodes.E118]: {
        code: 118,
        message: 'One or more auth tokens to not have a handler'
    }
};
function createError(errorCode, content) {
    const errorInfo = ErrorMessages[errorCode];
    return new rotiro_error_1.RotiroError(errorInfo.message, content, errorInfo.code);
}
exports.createError = createError;
//# sourceMappingURL=error-codes.js.map