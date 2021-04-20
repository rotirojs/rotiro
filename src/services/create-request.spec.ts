import { Endpoints } from '../classes';
import { Mappers } from '../classes/mappers';
import { MethodSchema, RestMethods } from '../type-defs';
import { createRequest } from './create-request';

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
          body: {},
          method: 'GET',
          pathName: '/users/234',
          path: {
            id: { name: 'id', type: 'number', valid: true, value: 234 }
          },
          pathPattern: /^\/users(?:\/([^\/#\?]+?))[\/#\?]?$/i,
          query: {},
          routeName: 'user',
          valid: true,
          headers: {},
          meta: {}
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
        const pathName = '/users/234';
        const result = createRequest(pathName, METHOD, endPoints, mappers);
        deleteResponseFunctions(result, GETResponse);
        expect(result).toEqual(GETResponse);
      });

      it('Should set the auth token name', () => {
        endPoints.add('users', '/users', {
          GET: { auth: 'authToken' }
        });
        const pathName = '/users';
        const result = createRequest(pathName, METHOD, endPoints, mappers);
        expect(result.authTokenName).toEqual('authToken');
      });

      it('Should fail if path does not contain a valid parameter', () => {
        endPoints.add(
          'user',
          '/users/:id',
          [],
          [{ name: 'id', type: 'number' }]
        );
        const pathName = '/users/bob';
        const result = createRequest(pathName, METHOD, endPoints, mappers);

        expect(result.valid).toEqual(false);
      });

      it('Should fail if query does not contain a valid parameter', () => {
        endPoints.add('user', '/users', {
          GET: { queryParams: [{ name: 'version', type: 'number' }] }
        });
        const pathName = '/users?version=bob';
        const result = createRequest(pathName, METHOD, endPoints, mappers);

        expect(result.valid).toEqual(false);
      });

      it('Should create a request from a DELETE Path', () => {
        endPoints.add(
          'user',
          '/users/:id',
          [],
          [{ name: 'id', type: 'number' }]
        );
        const pathName = '/users/234';
        const result = createRequest(pathName, 'DELETE', endPoints, mappers);
        GETResponse.method = 'DELETE';
        deleteResponseFunctions(result, GETResponse);
        expect(result).toEqual(GETResponse);
      });

      it('Should create a request from a GET Path with query', () => {
        endPoints.add(
          'user',
          '/users/:id',
          { GET: { queryParams: [{ name: 'version', type: 'number' }] } },
          [{ name: 'id', type: 'number' }]
        );
        const pathName = '/users/234?version=4332';
        GETResponse.rawQuery = 'version=4332';
        GETResponse.query = {
          version: {
            name: 'version',
            type: 'number',
            valid: true,
            value: 4332
          }
        };
        const result = createRequest(pathName, METHOD, endPoints, mappers);
        deleteResponseFunctions(result, GETResponse);
        expect(result).toEqual(GETResponse);
      });


      it('Gets query without schema defined in none strict mode', () => {
        endPoints.add(
          'user',
          '/users/:id',
          ['GET'],
          [{ name: 'id', type: 'number' }]
        );
        const pathName = '/users/234?version=4332';
        GETResponse.rawQuery = 'version=4332';
        GETResponse.query = {
          version: {
            name: 'version',
            type: 'string', // not defined so assumes string
            valid: true,
            value: "4332"
          }
        };
        const result = createRequest(pathName, METHOD, endPoints, mappers);
        deleteResponseFunctions(result, GETResponse);
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
          pathName: '/users/234',
          path: {
            id: { name: 'id', type: 'number', valid: true, value: 234 }
          },
          pathPattern: /^\/users(?:\/([^\/#\?]+?))[\/#\?]?$/i,
          query: {},
          routeName: 'user',
          valid: true,
          meta: {},
          headers: {}
        };
      });

      // add query params, POST, patch etc

      it('Should create a request from a POST ', () => {
        endPoints.add('user', '/users/:id', methodConfig, [
          { name: 'id', type: 'number' }
        ]);
        const pathName = '/users/234';
        const body: any = { name: 'Jim', count: 43 };
        const result = createRequest(
          pathName,
          METHOD,
          endPoints,
          mappers,
          body
        );
        deleteResponseFunctions(result, POSTResponse);
        expect(result).toEqual(POSTResponse);
      });

      it('Should create a request from a PATCH', () => {
        methodConfig = {
          PATCH: bodyParamsConfig
        };
        endPoints.add('user', '/users/:id', methodConfig, [
          { name: 'id', type: 'number' }
        ]);
        const pathName = '/users/234';
        const body: any = { name: 'Jim', count: 43 };
        const result = createRequest(
          pathName,
          'PATCH',
          endPoints,
          mappers,
          body
        );
        POSTResponse.method = 'PATCH';
        deleteResponseFunctions(result, POSTResponse);
        expect(result).toEqual(POSTResponse);
      });

      it('Should create a request from a PUT', () => {
        methodConfig = {
          PUT: bodyParamsConfig
        };
        endPoints.add('user', '/users/:id', methodConfig, [
          { name: 'id', type: 'number' }
        ]);
        const pathName = '/users/234';
        const body: any = { name: 'Jim', count: 43 };
        const result = createRequest(pathName, 'PUT', endPoints, mappers, body);
        POSTResponse.method = 'PUT';
        deleteResponseFunctions(result, POSTResponse);
        expect(result).toEqual(POSTResponse);
      });

      it('Should fail if no body received when body contains required parameters', () => {
        endPoints.add('user', '/users/:id', methodConfig, [
          { name: 'id', type: 'number' }
        ]);
        const pathName = '/users/234';
        const result = createRequest(pathName, METHOD, endPoints, mappers);
        POSTResponse.valid = false;
        POSTResponse.rawBody = undefined;
        POSTResponse.body.name.valid = false;
        POSTResponse.body.name.value = undefined;
        POSTResponse.body.count.valid = false;
        POSTResponse.body.count.value = undefined;
        deleteResponseFunctions(result, POSTResponse);
        expect(result).toEqual(POSTResponse);
      });
    });
  });
});

function deleteResponseFunctions(result: any, expectedResult: any) {
  delete result.send;
  delete expectedResult.send;
}
