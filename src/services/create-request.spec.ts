import { Endpoints } from '../classes';
import { Mappers } from '../classes/mappers';
import { MethodSchema, RestMethods } from '../type-defs';
import { createRequest } from './create-request';
import { sendResponse } from './send-response';

describe('services/create-request', () => {
  describe('createRequest', () => {
    describe('GET requests', () => {
      const METHOD: RestMethods = 'GET';
      let endPoints: Endpoints;
      let mappers: Mappers;
      let GETResponse: any;
      beforeEach(() => {
        endPoints = new Endpoints();
        mappers = new Mappers();
        GETResponse = {
          authenticated: false,
          rawBody: undefined,
          body: {},
          method: 'GET',
          path: '/users/234',
          pathParams: {
            id: { name: 'id', type: 'number', valid: true, value: 234 }
          },
          pathPattern: /^\/users(?:\/([^\/#\?]+?))[\/#\?]?$/i,
          rawQuery: '',
          query: {},
          request: null,
          routeName: 'user',
          valid: false,
          sendResponse
        };
      });

      // add query params, POST, patch etc

      it('Should create a request from a GET Path', () => {
        endPoints.add(
          'user',
          '/users/:id',
          [],
          [{ name: 'id', type: 'number' }]
        );
        const path = '/users/234';
        const result = createRequest(path, METHOD, endPoints, mappers);
        expect(result).toEqual(GETResponse);
      });

      it('Should create a request from a DELETE Path', () => {
        endPoints.add(
          'user',
          '/users/:id',
          [],
          [{ name: 'id', type: 'number' }]
        );
        const path = '/users/234';
        const result = createRequest(path, 'DELETE', endPoints, mappers);
        GETResponse.method = 'DELETE';
        expect(result).toEqual(GETResponse);
      });

      it('Should create a request from a GET Path with query', () => {
        endPoints.add(
          'user',
          '/users/:id',
          { GET: { queryParams: [{ name: 'version', type: 'number' }] } },
          [{ name: 'id', type: 'number' }]
        );
        const path = '/users/234?version=4332';
        GETResponse.rawQuery = 'version=4332';
        GETResponse.query = {
          version: {
            name: 'version',
            type: 'number',
            valid: true,
            value: 4332
          }
        };
        const result = createRequest(path, METHOD, endPoints, mappers);
        expect(result).toEqual(GETResponse);
      });
    });

    describe('POST requests', () => {
      const METHOD: RestMethods = 'POST';
      let endPoints: Endpoints;
      let mappers: Mappers;
      let POSTResponse: any;
      let methodConfig: Record<string, MethodSchema>;
      let bodyParamsConfig: any;
      beforeEach(() => {
        endPoints = new Endpoints();
        mappers = new Mappers();
        bodyParamsConfig = {
          bodyParams: [
            { name: 'name', type: 'string' },
            {
              name: 'count',
              type: 'number'
            }
          ]
        };
        methodConfig = {
          POST: bodyParamsConfig
        };
        POSTResponse = {
          authenticated: false,
          rawBody: { count: 43, name: 'Jim' },
          body: {
            count: {
              name: 'count',
              type: 'number',
              valid: true,
              value: 43
            },
            name: {
              name: 'name',
              type: 'string',
              valid: true,
              value: 'Jim'
            }
          },
          method: 'POST',
          path: '/users/234',
          pathParams: {
            id: { name: 'id', type: 'number', valid: true, value: 234 }
          },
          pathPattern: /^\/users(?:\/([^\/#\?]+?))[\/#\?]?$/i,
          rawQuery: '',
          query: {},
          request: null,
          routeName: 'user',
          valid: false,
          sendResponse
        };
      });

      // add query params, POST, patch etc

      it('Should create a request from a POST ', () => {
        endPoints.add('user', '/users/:id', methodConfig, [
          { name: 'id', type: 'number' }
        ]);
        const path = '/users/234';
        const body: any = { name: 'Jim', count: 43 };
        const result = createRequest(path, METHOD, endPoints, mappers, body);
        expect(result).toEqual(POSTResponse);
      });

      it('Should create a request from a PATCH', () => {
        methodConfig = {
          PATCH: bodyParamsConfig
        };
        endPoints.add('user', '/users/:id', methodConfig, [
          { name: 'id', type: 'number' }
        ]);
        const path = '/users/234';
        const body: any = { name: 'Jim', count: 43 };
        const result = createRequest(path, 'PATCH', endPoints, mappers, body);
        POSTResponse.method = 'PATCH';
        expect(result).toEqual(POSTResponse);
      });

      it('Should create a request from a PUT', () => {
        methodConfig = {
          PUT: bodyParamsConfig
        };
        endPoints.add('user', '/users/:id', methodConfig, [
          { name: 'id', type: 'number' }
        ]);
        const path = '/users/234';
        const body: any = { name: 'Jim', count: 43 };
        const result = createRequest(path, 'PUT', endPoints, mappers, body);
        POSTResponse.method = 'PUT';
        expect(result).toEqual(POSTResponse);
      });

      it('Should fail if no body received when body contains required parameters', () => {
        endPoints.add('user', '/users/:id', methodConfig, [
          { name: 'id', type: 'number' }
        ]);
        const path = '/users/234';
        const result = createRequest(path, METHOD, endPoints, mappers);
        POSTResponse.rawBody = undefined;
        POSTResponse.body.name.valid = false;
        POSTResponse.body.name.value = undefined;
        POSTResponse.body.count.valid = false;
        POSTResponse.body.count.value = undefined;
        expect(result).toEqual(POSTResponse);
      });
    });
  });
});
