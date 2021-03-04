import { Mappers } from '../../classes/mappers';
import { ApiRequestParam, MethodSchemaParam, RouteParameter } from '../../type-defs';
export declare function getBodyParams(body: any, bodySchema: MethodSchemaParam[], mappers: Mappers): Record<string, ApiRequestParam>;
export declare function assignBodyParam(routeParams: Record<string, RouteParameter>): MethodSchemaParam[];
//# sourceMappingURL=body-params.d.ts.map