import { DataMapperFunc } from '../type-defs';
export declare class Mappers {
    get locked(): boolean;
    private _mappers;
    private _locked;
    constructor();
    lock(): void;
    mapDataType(data: any | any[], type: string): any | any[];
    getMapper(type: string): DataMapperFunc;
    registerMapper(type: string, mapper: DataMapperFunc): void;
    private registerDefaultMappers;
}
//# sourceMappingURL=mappers.d.ts.map