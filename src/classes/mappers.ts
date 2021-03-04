import { DataMapperFunc } from '../type-defs';
import { jsonMapper, numberMapper, stringMapper } from '../utils/mappers';

export class Mappers {

  public get locked(): boolean {
    return this._locked;
  }
  private _mappers: Record<string, DataMapperFunc> = {};

  private _locked: boolean = false;

  constructor() {
    // add default mappers
    this.registerDefaultMappers();
  }

  public lock(): void {
    this._locked = true;
  }

  public mapDataType(data: any | any[], type: string): any | any[] {
    const mapperFunc: DataMapperFunc = this.getMapper(type);
    return mapperFunc(data);
  }

  public getMapper(type: string): DataMapperFunc {
    let mapper: DataMapperFunc = this._mappers[type];
    if (!mapper) {
      mapper = this._mappers.string;
    }
    return mapper;
  }

  public registerMapper(type: string, mapper: DataMapperFunc): void {
    if (this.locked) {
      throw new Error('Api is locked and cannot be updated');
    }
    this._mappers[type] = mapper;
  }

  private registerDefaultMappers(): void {
    this.registerMapper('string', stringMapper);
    this.registerMapper('number', numberMapper);
    this.registerMapper('json', jsonMapper);
  }
}
