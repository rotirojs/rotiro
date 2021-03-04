import { Mappers } from '../../classes/mappers';
import {
  ApiRequestParam,
  MethodSchemaParam,
  RouteParameter
} from '../../type-defs';
import { assignBodyParam, getBodyParams } from './body-params';

describe('utils/request-params/body-params', () => {
  let mappers;
  beforeEach(() => {
    mappers = new Mappers();
  });

  describe('getBodyParams', () => {
    it('Should not return any params if no params are defined', () => {
      const body: any = { value: 'test' };
      const bodySchema: MethodSchemaParam[] = [];

      const result: Record<string, ApiRequestParam> = getBodyParams(
        body,
        bodySchema,
        mappers.mapDataType
      );
      expect(result).toEqual({});
    });

    describe('Valid Parameters', () => {
      let body: any = {};
      let bodySchema: MethodSchemaParam[] = [];

      beforeEach(() => {
        body = { id: 'test' };
        bodySchema = [{ type: 'string', name: 'id' }];
      });

      it('Should match a parameter in the body', () => {
        const result: Record<string, ApiRequestParam> = getBodyParams(
          body,
          bodySchema,
          mappers
        );
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: true,
            value: 'test'
          }
        });
      });

      it('Should match a number parameter in the body', () => {
        body.id = 3;
        bodySchema = [{ type: 'number', name: 'id' }];
        const result: Record<string, ApiRequestParam> = getBodyParams(
          body,
          bodySchema,
          mappers
        );
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'number',
            valid: true,
            value: 3
          }
        });
      });

      it('Should match a number from string parameter in the body', () => {
        body.id = '3';
        bodySchema = [{ type: 'number', name: 'id' }];
        const result: Record<string, ApiRequestParam> = getBodyParams(
          body,
          bodySchema,
          mappers
        );
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'number',
            valid: true,
            value: 3
          }
        });
      });

      it('Should match an object parameter in the body', () => {
        body.id = JSON.stringify({ test: 'case' });
        bodySchema = [{ type: 'json', name: 'id' }];
        const result: Record<string, ApiRequestParam> = getBodyParams(
          body,
          bodySchema,
          mappers
        );
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'json',
            valid: true,
            value: { test: 'case' }
          }
        });
      });

      it('Should match a multiple parameters in the body', () => {
        body = { id: 'test', value1: 'red', value2: 3 };
        bodySchema.push({ type: 'string', name: 'value1' });
        bodySchema.push({ type: 'number', name: 'value2' });
        const result: Record<string, ApiRequestParam> = getBodyParams(
          body,
          bodySchema,
          mappers
        );
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: true,
            value: 'test'
          },
          value1: {
            name: 'value1',
            type: 'string',
            valid: true,
            value: 'red'
          },
          value2: {
            name: 'value2',
            type: 'number',
            valid: true,
            value: 3
          }
        });
      });

      it('Should return an array if array passed in', () => {
        bodySchema = [{ type: 'string', name: 'id', array: true }];
        body = { id: ['test', 'test2'] };
        const result = getBodyParams(body, bodySchema, mappers);
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: true,
            value: ['test', 'test2']
          }
        });
      });

      it('Should return an empty array if optional and no parameter supplied', () => {
        bodySchema = [
          { type: 'string', name: 'id', array: true, optional: true }
        ];
        body = {};
        const result = getBodyParams(body, bodySchema, mappers);
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: true,
            value: []
          }
        });
      });
    });

    describe('Invalid Parameters', () => {
      it('Should error if required parameter missing', () => {
        const bodySchema = [{ type: 'string', name: 'id' }];
        const body = { id1: 'test' };
        const result = getBodyParams(body, bodySchema, mappers);
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: false,
            value: undefined
          }
        });
      });

      it('Should not error if optional parameter missing', () => {
        const bodySchema = [{ type: 'string', name: 'id', optional: true }];
        const body = { id1: 'test' };
        const result = getBodyParams(body, bodySchema, mappers);
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: true,
            value: undefined
          }
        });
      });

      it('Should return empty array if array value optional', () => {
        const bodySchema = [
          { type: 'string', name: 'id', optional: true, array: true }
        ];
        const body = {};
        const result = getBodyParams(body, bodySchema, mappers);
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: true,
            value: []
          }
        });
      });

      it('Should error if required array parameter is not an array', () => {
        const bodySchema = [{ type: 'string', name: 'id', array: true }];
        const body = { id1: 'test' };
        const result = getBodyParams(body, bodySchema, mappers);
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: false,
            value: undefined
          }
        });
      });

      it('Should return invalid if array passed in to none array parameter', () => {
        const bodySchema = [{ type: 'string', name: 'id', array: false }];
        const body = { id: ['test', 'test2'] };
        const result = getBodyParams(body, bodySchema, mappers);
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: false,
            value: undefined
          }
        });
      });

      it('Should return invalid if expecting array and none passed', () => {
        const bodySchema = [{ type: 'string', name: 'id', array: true }];
        const body = { id: 'test' };
        const result = getBodyParams(body, bodySchema, mappers);
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: false,
            value: undefined
          }
        });
      });
    });

    describe('Undefined Body', () => {
      it('Should return undefined and valid false when no body', () => {
        const body: any = undefined;
        const bodySchema = [{ type: 'string', name: 'id' }];

        const result: Record<string, ApiRequestParam> = getBodyParams(
          body,
          bodySchema,
          mappers.mapDataType
        );
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: false,
            value: undefined
          }
        });
      });

      it('Should return valid empty array for optional array when no body', () => {
        const body: any = undefined;
        const bodySchema = [
          { type: 'string', name: 'id', optional: true, array: true }
        ];

        const result: Record<string, ApiRequestParam> = getBodyParams(
          body,
          bodySchema,
          mappers.mapDataType
        );
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: true,
            value: []
          }
        });
      });

      it('Should return valid undefined for optional value when no body', () => {
        const body: any = undefined;
        const bodySchema = [{ type: 'string', name: 'id', optional: true }];

        const result: Record<string, ApiRequestParam> = getBodyParams(
          body,
          bodySchema,
          mappers.mapDataType
        );
        expect(result).toEqual({
          id: {
            name: 'id',
            type: 'string',
            valid: true,
            value: undefined
          }
        });
      });
    });
  });

  describe('assignBodyParam', () => {
    it('Should return a method schema array', () => {
      const body: Record<string, RouteParameter> = {
        id: {
          type: 'string'
        }
      };

      expect(assignBodyParam(body)).toEqual([
        {
          name: 'id',
          type: 'string'
        }
      ]);
    });

    it('Should handle an empty body and return empty array', () => {
      const body: Record<string, RouteParameter> = {};

      expect(assignBodyParam(body)).toEqual([]);
    });

    it('Should handle a body with an array', () => {
      const body: Record<string, RouteParameter> = {
        id: {
          type: 'string',
          array: true
          // optional?: boolean;
          // meta?: RouteMeta;
        }
      };

      expect(assignBodyParam(body)).toEqual([
        {
          array: true,
          name: 'id',
          type: 'string'
        }
      ]);
    });

    it('Should handle a body with an optional parameter', () => {
      const body: Record<string, RouteParameter> = {
        id: {
          type: 'string',
          optional: true
        }
      };

      expect(assignBodyParam(body)).toEqual([
        {
          optional: true,
          name: 'id',
          type: 'string'
        }
      ]);
    });

    it('Should handle a mix of body properties', () => {
      const body: Record<string, RouteParameter> = {
        id: {
          type: 'string'
        },
        names: {
          type: 'string',
          array: true
        },
        age: {
          type: 'number',
          optional: true
        }
      };

      expect(assignBodyParam(body)).toEqual([
        {
          name: 'id',
          type: 'string'
        },
        {
          array: true,
          name: 'names',
          type: 'string'
        },
        {
          name: 'age',
          optional: true,
          type: 'number'
        }
      ]);
    });
  });
});
