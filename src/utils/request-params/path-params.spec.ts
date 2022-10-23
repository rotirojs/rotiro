import { Endpoints } from '../../classes';
import { Mappers } from '../../classes/mappers';
import { RotiroError } from '../../errors';
import { createError, ErrorCodes } from '../../errors/error-codes';
import { ApiEndpointSchema } from '../../type-defs';
import { getPathParams, setParameterOrder } from './path-params';

describe('utils/request-params/path-params', () => {
  let mappers;
  let endpoints: Endpoints;
  beforeEach(() => {
    endpoints = new Endpoints();
    mappers = new Mappers();
  });

  describe('getPathParams', () => {
    it('should return all parameters from path', () => {
      const path: string = '/user/apple';

      const endpoint: ApiEndpointSchema = endpoints.add(
        'userId',
        '/user/:id',
        ['GET'],
        [{ name: 'id', type: 'string' }]
      );

      const result = getPathParams(path, endpoint, mappers);
      expect(result).toEqual({
        id: { name: 'id', type: 'string', valid: true, value: 'apple' }
      });
    });

    it('should convert numerical parameters from text', () => {
      const path: string = '/user/42';

      const endpoint: ApiEndpointSchema = endpoints.add(
        'userId',
        '/user/:id',
        ['GET'],
        [{ name: 'id', type: 'number' }]
      );

      const result = getPathParams(path, endpoint, mappers);
      expect(result).toEqual({
        id: { name: 'id', type: 'number', valid: true, value: 42 }
      });
    });

    it('should match multiple parameters from path', () => {
      const path: string = '/user/232/items/blue';

      const endpoint: ApiEndpointSchema = endpoints.add(
        'userId',
        '/user/:id/items/:color',
        ['GET'],
        [
          { name: 'id', type: 'number' },
          { name: 'color', type: 'string' }
        ]
      );

      const result = getPathParams(path, endpoint, mappers);
      expect(result).toEqual({
        id: { name: 'id', type: 'number', valid: true, value: 232 },
        color: { name: 'color', type: 'string', valid: true, value: 'blue' }
      });
    });

    it('should error numerical parameters are not valid', () => {
      const path: string = '/user/james';

      const endpoint: ApiEndpointSchema = endpoints.add(
        'userId',
        '/user/:id',
        ['GET'],
        [{ name: 'id', type: 'number' }]
      );

      const result = getPathParams(path, endpoint, mappers);
      expect(result).toEqual({
        id: { name: 'id', type: 'number', valid: false, value: undefined }
      });
    });

    it('should throw error if path not matched', () => {
      const path: string = '/user/42';

      const endpoint: ApiEndpointSchema = endpoints.add(
        'userId',
        '/user/:id/red',
        ['GET'],
        [{ name: 'id', type: 'number' }]
      );

      let error: RotiroError | undefined;
      try {
        getPathParams(path, endpoint, mappers);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.InvalidParameters);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('should return empty object if no params', () => {
      const path: string = '/user/name';

      const endpoint: ApiEndpointSchema = endpoints.add(
        'userId',
        '/user/name',
        ['GET']
      );

      const result = getPathParams(path, endpoint, mappers);
      expect(result).toEqual({});
    });
  });

  describe('setParameterOrder', () => {
    it('should map parameter names when defined in order', () => {
      const endpoint: any = {
        path: '/test/:param1/stuff/:param2',
        pathParams: [
          { name: 'param1', type: 'string' },
          { name: 'param2', type: 'string' }
        ]
      };
      setParameterOrder(endpoint);

      expect(endpoint.pathParams).toEqual([
        { name: 'param1', type: 'string' },
        { name: 'param2', type: 'string' }
      ]);
    });

    it('should map parameter names when defined in the wrong order', () => {
      const endpoint: any = {
        path: '/test/:param1/stuff/:param2',
        pathParams: [
          { name: 'param2', type: 'string' },
          { name: 'param1', type: 'string' }
        ]
      };
      setParameterOrder(endpoint);

      expect(endpoint.pathParams).toEqual([
        { name: 'param1', type: 'string' },
        { name: 'param2', type: 'string' }
      ]);
    });

    it('should map parameter names when url includes file ext', () => {
      const endpoint: any = {
        path: '/test/:param1/stuff/:param2.png',
        pathParams: [
          { name: 'param2', type: 'string' },
          { name: 'param1', type: 'string' }
        ]
      };
      setParameterOrder(endpoint);

      expect(endpoint.pathParams).toEqual([
        { name: 'param1', type: 'string' },
        { name: 'param2', type: 'string' }
      ]);
    });

    it('should map parameter names are adjacent', () => {
      const endpoint: any = {
        path: '/test/:param1/:param2',
        pathParams: [
          { name: 'param2', type: 'string' },
          { name: 'param1', type: 'string' }
        ]
      };
      setParameterOrder(endpoint);

      expect(endpoint.pathParams).toEqual([
        { name: 'param1', type: 'string' },
        { name: 'param2', type: 'string' }
      ]);
    });

    it('should map parameter names when defined in mixed order', () => {
      const endpoint: any = {
        path: '/test/:param1/stuff/:param2/:param3/sdf/:param4',
        pathParams: [
          { name: 'param2', type: 'string' },
          { name: 'param4', type: 'string' },
          { name: 'param1', type: 'string' },
          { name: 'param3', type: 'string' }
        ]
      };
      setParameterOrder(endpoint);

      expect(endpoint.pathParams).toEqual([
        {
          name: 'param1',
          type: 'string'
        },
        {
          name: 'param2',
          type: 'string'
        },
        {
          name: 'param3',
          type: 'string'
        },
        {
          name: 'param4',
          type: 'string'
        }
      ]);
    });
  });
});
