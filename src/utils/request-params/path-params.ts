import { Mappers } from '../../classes/mappers';
import { createError, ErrorCodes } from '../../errors/error-codes';
import { ApiEndpointSchema, ApiRequestParam } from '../../type-defs';

export function getPathParams(
  path: string,
  endpoint: ApiEndpointSchema,
  mappers: Mappers
): Record<string, ApiRequestParam> {
  const pathParams: Record<string, ApiRequestParam> = {};

  if (endpoint.pathParams && endpoint.pathParams.length) {
    setParameterOrder(endpoint);
    // get the names and values from the path
    let params: string[] | null = path.match(endpoint.pattern);
    if (!params) {
      throw createError(ErrorCodes.InvalidParameters);
    }
    params = params.slice(1, endpoint.pathParams.length + 1);
    for (let i = 0; i < endpoint.pathParams.length; i++) {
      const value: any = mappers.mapDataType(
        params[i],
        endpoint.pathParams[i].type
      );

      const requestParam: ApiRequestParam = {
        ...endpoint.pathParams[i],
        value,
        valid: typeof value !== 'undefined'
      };
      pathParams[requestParam.name] = requestParam;
    }
  }
  return pathParams;
}

export function setParameterOrder(endpoint: ApiEndpointSchema): void {
  if (endpoint.pathParams && endpoint.pathParams.length) {
    const pathParts: string[] = endpoint.path.split('/');
    const pathOrder: string[] = [];

    const pathParams: Record<string, any> = {};
    for (const pathParam of endpoint.pathParams) {
      pathParams[pathParam.name] = pathParam;
    }

    for (const part of pathParts) {
      if (part.startsWith(':')) {
        let pathPart: string = part;
        const sepPos: number = pathPart.indexOf('.');
        if (sepPos > -1) {
          pathPart = pathPart.substring(0, sepPos);
        }
        pathOrder.push(pathPart.substring(1));
      }
    }

    const updatePathParams: any[] = [];
    for (const pathOrderItem of pathOrder) {
      updatePathParams.push(pathParams[pathOrderItem]);
    }
    endpoint.pathParams = updatePathParams;
  }
}
