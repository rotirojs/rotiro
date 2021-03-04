import { Mappers } from '../../classes/mappers';
import {
  ApiRequestParam,
  MethodSchemaParam,
  RouteParameter
} from '../../type-defs';

export function getBodyParams(
  body: any,
  bodySchema: MethodSchemaParam[],
  mappers: Mappers
): Record<string, ApiRequestParam> {
  const bodyParams: Record<string, ApiRequestParam> = {};

  if (bodySchema.length) {
    if (typeof body === 'undefined') {
      for (const bodyParameter of bodySchema) {
        let value: any;
        let valid: boolean = false;

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
      let value: any | any[];
      let valid: boolean = true;
      if (typeof body[bodyParameter.name] === 'undefined') {
        if (!bodyParameter.optional) {
          valid = false;
        } else {
          if (bodyParameter.array) {
            value = [];
          }
        }
      } else {
        if (bodyParameter.array && !Array.isArray(body[bodyParameter.name])) {
          valid = false;
        } else if (
          !bodyParameter.array &&
          Array.isArray(body[bodyParameter.name])
        ) {
          valid = false;
        } else {
          value = mappers.mapDataType(
            body[bodyParameter.name],
            bodyParameter.type
          );
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

export function assignBodyParam(
  routeParams: Record<string, RouteParameter>
): MethodSchemaParam[] {
  const schemaParams: MethodSchemaParam[] = [];

  const propKeys: string[] = Object.keys(routeParams);
  if (propKeys.length > 0) {
    for (const propKey of propKeys) {
      const routeParameter: RouteParameter = routeParams[propKey];

      const schemaParam: MethodSchemaParam = {
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
