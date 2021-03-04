"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignBodyParam = exports.getBodyParams = void 0;
function getBodyParams(body, bodySchema, mappers) {
    const bodyParams = {};
    if (bodySchema.length) {
        if (typeof body === 'undefined') {
            for (const bodyParameter of bodySchema) {
                let value;
                let valid = false;
                if (bodyParameter.optional) {
                    valid = true;
                    if (bodyParameter.array) {
                        value = [];
                    }
                }
                bodyParams[bodyParameter.name] = {
                    name: bodyParameter.name,
                    type: bodyParameter.type,
                    value,
                    valid
                };
            }
            return bodyParams;
        }
        for (const bodyParameter of bodySchema) {
            let value;
            let valid = true;
            if (typeof body[bodyParameter.name] === 'undefined') {
                if (!bodyParameter.optional) {
                    valid = false;
                }
                else {
                    if (bodyParameter.array) {
                        value = [];
                    }
                }
            }
            else {
                if (bodyParameter.array && !Array.isArray(body[bodyParameter.name])) {
                    valid = false;
                }
                else if (!bodyParameter.array &&
                    Array.isArray(body[bodyParameter.name])) {
                    valid = false;
                }
                else {
                    value = mappers.mapDataType(body[bodyParameter.name], bodyParameter.type);
                    valid = typeof value !== 'undefined';
                }
            }
            bodyParams[bodyParameter.name] = {
                name: bodyParameter.name,
                type: bodyParameter.type,
                value,
                valid
            };
        }
    }
    return bodyParams;
}
exports.getBodyParams = getBodyParams;
function assignBodyParam(routeParams) {
    const schemaParams = [];
    const propKeys = Object.keys(routeParams);
    if (propKeys.length > 0) {
        for (const propKey of propKeys) {
            const routeParameter = routeParams[propKey];
            const schemaParam = {
                type: routeParameter.type,
                name: propKey
            };
            if (routeParameter.array) {
                schemaParam.array = true;
            }
            if (routeParameter.optional) {
                schemaParam.optional = true;
            }
            schemaParams.push(schemaParam);
        }
    }
    return schemaParams;
}
exports.assignBodyParam = assignBodyParam;
//# sourceMappingURL=body-params.js.map