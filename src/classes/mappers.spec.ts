import { RotiroError } from '../errors';
import { createError, ErrorCodes } from '../errors/error-codes';
import { DataMapperFunc } from '../type-defs';
import { stringMapper } from '../utils/mappers';
import { Mappers } from './mappers';

describe('classes/mappers', () => {
  let mappers: Mappers;

  describe('lock', () => {
    beforeEach(() => {
      mappers = new Mappers();
    });

    it('Mappers should not be locked initially', () => {
      expect(mappers.locked).toEqual(false);
    });

    it('Should lock mappers', () => {
      mappers.lock();
      expect(mappers.locked).toEqual(true);
    });

    it('Should lock the class and throw error if changed', () => {
      mappers.lock();

      let error: RotiroError | undefined;
      try {
        const func: any = undefined;
        mappers.registerMapper('string', func);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.ApiLocked);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });
  });

  describe('mapDataType', () => {
    beforeEach(() => {
      mappers = new Mappers();
    });

    it('Should convert a unknown type to a string', () => {
      expect(mappers.mapDataType(3, 'stringy')).toEqual('3');
    });

    it('Should convert a string to a string', () => {
      expect(mappers.mapDataType('test', 'string')).toEqual('test');
    });

    it('Should convert a string to a number', () => {
      expect(mappers.mapDataType('33', 'number')).toEqual(33);
    });

    it('Should convert a string array to a number array', () => {
      expect(mappers.mapDataType(['33', '44'], 'number')).toEqual([33, 44]);
    });

    it('Should convert a json string to an object', () => {
      expect(mappers.mapDataType('{"name":"Bob"}', 'json')).toEqual({
        name: 'Bob'
      });
    });
  });

  describe('getMapper', () => {
    beforeEach(() => {
      mappers = new Mappers();
    });

    it('Should return a string mapper if no mapper found', () => {
      const result = mappers.getMapper('bob');
      expect(result).toEqual(stringMapper);
    });
  });

  describe('registerMapper', () => {
    beforeEach(() => {
      mappers = new Mappers();
    });
    it('Should and and get a new mapper', () => {
      const func: DataMapperFunc = (data: string) => {
        return data;
      };
      mappers.registerMapper('some-type', func);
      expect(mappers.getMapper('some-type')).toEqual(func);
    });
  });
});
