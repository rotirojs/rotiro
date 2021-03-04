import { jsonMapper, numberMapper, stringMapper } from './mappers';

describe('utils/mappers', () => {
  describe('stringMapper', () => {
    it('Empty string to be returned as empty string', () => {
      expect(stringMapper('')).toEqual('');
    });

    it('string to be returned as same string', () => {
      expect(stringMapper('Bob')).toEqual('Bob');
    });

    it('number to be returned as string', () => {
      expect(stringMapper(2)).toEqual('2');
    });

    it('null to be returned as empty string', () => {
      expect(stringMapper(null)).toEqual('');
    });

    it('undefined to be returned as empty string', () => {
      expect(stringMapper(undefined)).toEqual('');
    });

    it('array of strings to be returned as string array', () => {
      expect(stringMapper(['one', 'two', 'three'])).toEqual([
        'one',
        'two',
        'three'
      ]);
    });
    it('array of numbers to be returned as string array', () => {
      expect(stringMapper([1, 2, 3])).toEqual(['1', '2', '3']);
    });

    it('array of mixed items to be returned as string array', () => {
      expect(stringMapper([1, '  ', undefined, 'bob'])).toEqual([
        '1',
        '  ',
        '',
        'bob'
      ]);
    });
  });
  describe('numberMapper', () => {
    it('string to be returned as number', () => {
      expect(numberMapper('2')).toEqual(2);
    });

    it('string array to be returned as number array', () => {
      expect(numberMapper(['2', '3'])).toEqual([2, 3]);
    });

    it('invalid number returned as undefined', () => {
      expect(numberMapper('asdf')).toEqual(undefined);
    });
  });
  describe('jsonMapper', () => {
    it('return object from json string', () => {
      expect(jsonMapper('{"name":"Bob"}')).toEqual({ name: 'Bob' });
    });

    it('return object array from json string array', () => {
      expect(jsonMapper(['{"name":"Bob"}', '{"name":"Jack"}'])).toEqual([
        { name: 'Bob' },
        { name: 'Jack' }
      ]);
    });
  });
});
