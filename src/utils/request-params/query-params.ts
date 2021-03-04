import { Mappers } from "../../classes/mappers";
import { ApiRequestParam, MethodSchemaParam } from "../../type-defs";
import { extractStringArrayFromText } from "../arrays";
import { getQueryAsObject } from "../paths";

export function getQueryParams(
  query: string,
  querySchema: MethodSchemaParam[],
  mappers: Mappers
): Record<string, ApiRequestParam> {
  const queryParams: Record<string, ApiRequestParam> = {};
  // only process if some params are declared
  if (querySchema.length) {
    // split the query params into an object
    const queryData: Record<string, string> = getQueryAsObject(query);

    for (const schemaItem of querySchema) {
      let value: any | any[] = queryData[schemaItem.name];
      let valid = true;
      if (typeof value === "undefined") {
        if (!schemaItem.optional) {
          valid = false;
        } else if (schemaItem.array) {
          value = [];
        }
      } else {
        // Todo Refactor this and body params to share code

        if (schemaItem.array) {
          value = extractStringArrayFromText(value);
        }

        value = mappers.mapDataType(value, schemaItem.type);
        valid = typeof value !== "undefined";
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
