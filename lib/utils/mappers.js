"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonMapper = exports.numberMapper = exports.stringMapper = void 0;
function stringMapper(text) {
    if (text === null || typeof text === 'undefined') {
        text = '';
    }
    else if (Array.isArray(text)) {
        return text.map((value) => stringMapper(value));
    }
    else if (typeof text !== 'string') {
        text = text.toString();
    }
    return text;
}
exports.stringMapper = stringMapper;
function numberMapper(text) {
    if (Array.isArray(text)) {
        const mappedValues = [];
        for (const textValue of text) {
            mappedValues.push(parseInt(textValue, 10));
        }
        return mappedValues;
    }
    else {
        const result = parseInt(text, 10);
        if (isNaN(result)) {
            return undefined;
        }
        else {
            return result;
        }
    }
}
exports.numberMapper = numberMapper;
function jsonMapper(text) {
    if (Array.isArray(text)) {
        const mappedValues = [];
        for (const textValue of text) {
            mappedValues.push(JSON.parse(textValue));
        }
        return mappedValues;
    }
    else {
        return JSON.parse(text);
    }
}
exports.jsonMapper = jsonMapper;
//# sourceMappingURL=mappers.js.map