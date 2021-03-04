"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryParams = void 0;
const arrays_1 = require("../arrays");
const paths_1 = require("../paths");
function getQueryParams(query, querySchema, mappers) {
    const queryParams = {};
    if (querySchema.length) {
        const queryData = paths_1.getQueryAsObject(query);
        for (const schemaItem of querySchema) {
            let value = queryData[schemaItem.name];
            let valid = true;
            if (typeof value === 'undefined') {
                if (!schemaItem.optional) {
                    valid = false;
                }
                else if (schemaItem.array) {
                    value = [];
                }
            }
            else {
                if (schemaItem.array) {
                    value = arrays_1.extractStringArrayFromText(value);
                }
                value = mappers.mapDataType(value, schemaItem.type);
                valid = typeof value !== 'undefined';
            }
            queryParams[schemaItem.name] = {
                name: schemaItem.name,
                value,
                valid,
                type: schemaItem.type
            };
        }
    }
    return queryParams;
}
exports.getQueryParams = getQueryParams;
//# sourceMappingURL=query-params.js.map