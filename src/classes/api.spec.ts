import { RotiroError, RotiroErrorResponse } from '../errors';
import {
  createError,
  ErrorCodes,
  RotiroErrorCode
} from '../errors/error-codes';
import { HttpErrors } from '../errors/http-error-codes';
import * as Logger from '../services/logger';
import {
  ApiRequest,
  ApiResponse,
  AuthenticatorFunc,
  RotiroMiddleware,
  RotiroMiddlewareFunc
} from '../type-defs';
import { Api } from './api';
import { Controllers } from './controllers';
import { Endpoints } from './endpoints';
import { Mappers } from './mappers';
import { Routes } from './routes';
jest.mock('../services/logger');

describe('classes/api', () => {
  describe('create', () => {
    let api: Api;
    beforeEach(() => {
      api = new Api();
    });

    it('Should create a new API instance', () => {
      expect(api.controllers).toBeInstanceOf(Controllers);
      expect(api.endpoints).toBeInstanceOf(Endpoints);
      expect(api.mappers).toBeInstanceOf(Mappers);
      expect(api.routes).toBeInstanceOf(Routes);
    });

    it('Should create a new API instance with options', () => {
      api = new Api({ basePath: '/', custom404: true });
      expect(api.controllers).toBeInstanceOf(Controllers);
      expect(api.endpoints).toBeInstanceOf(Endpoints);
      expect(api.mappers).toBeInstanceOf(Mappers);
      expect(api.routes).toBeInstanceOf(Routes);
    });

    it('Should initially be unlocked', () => {
      expect(api.locked).toEqual(false);
    });
  });

  describe('build', () => {
    let api: Api;
    beforeEach(() => {
      api = new Api();
    });

    it('should lock items on build', () => {
      api.build();
      expect(api.locked).toEqual(true);
      expect(api.controllers.locked).toEqual(true);
      expect(api.endpoints.locked).toEqual(true);
      expect(api.mappers.locked).toEqual(true);
    });

    it('Should throw an error if endpoint validation fails', () => {
      api.endpoints.add('bob', '/bob', ['GET']);
      let error: RotiroError | undefined;
      try {
        api.build();
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.ControllerMissing, [
        'bob:GET'
      ]);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
      expect((error as RotiroError).content).toEqual(expectedError.content);
    });

    it('Should throw error if endpoint auth not match a handler', () => {
      api.controllers.add('bob', 'GET', jest.fn());
      api.endpoints.add('bob', '/bob', { GET: { auth: 'authToken' } });

      let error: RotiroError | undefined;
      try {
        api.build();
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.UnassignedAuthToken, [
        'authToken has no handler registered'
      ]);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
      expect((error as RotiroError).content).toEqual(expectedError.content);
    });
  });

  describe('handleRequest', () => {
    let middleware: RotiroMiddleware;
    let api: Api;
    beforeEach(() => {
      api = new Api();
      middleware = {
        sendResponse: jest.fn(),
        requestDetail: {
          url: '',
          method: '',
          headers: {}
        }
      };
    });

    it('Should throw an error if request is missing originalUrl', async () => {
      middleware.requestDetail.method = 'GET';
      api.build();
      let error: any;
      try {
        await Api.handleRequest(api, middleware);
      } catch (ex) {
        error = ex;
      }
      expect(error).toEqual(createError(ErrorCodes.OriginalRequestNotValid));
    });

    it('Should throw an error if request is missing method', async () => {
      middleware.requestDetail.url = '/ping';
      api.build();
      let error: any;
      try {
        await Api.handleRequest(api, middleware);
      } catch (ex) {
        error = ex;
      }
      expect(error).toEqual(createError(ErrorCodes.OriginalRequestNotValid));
    });

    it('Should throw an error if request is missing all required params', async () => {
      api.build();
      let error: any;
      try {
        await Api.handleRequest(api, middleware);
      } catch (ex) {
        error = ex;
      }
      expect(error).toEqual(createError(ErrorCodes.OriginalRequestNotValid));
    });

    it('Should should handle a get request', async () => {
      const func = jest.fn();
      middleware.requestDetail.url = '/ping';
      middleware.requestDetail.method = 'GET';
      api.endpoints.add('ping', '/ping', ['GET']);
      api.controllers.add('ping', 'GET', func);
      api.build();

      await Api.handleRequest(api, middleware);
      expect(func).toBeCalled();
    });

    it('Should should handle a get request for a root path of /', async () => {
      const func = jest.fn();
      middleware.requestDetail.url = '/';
      middleware.requestDetail.method = 'GET';
      api.endpoints.add('home', '/', ['GET']);
      api.controllers.add('home', 'GET', func);
      api.build();
      await Api.handleRequest(api, middleware);
      expect(func).toBeCalled();
    });

    it('Should should handle a get request with parameter', async () => {
      const func = jest.fn();
      middleware.requestDetail.url = '/ping/bob';
      middleware.requestDetail.method = 'GET';
      api.endpoints.add(
        'ping',
        '/ping/:id',
        ['GET'],
        [{ name: 'id', type: 'string' }]
      );
      api.controllers.add('ping', 'GET', func);
      api.build();
      await Api.handleRequest(api, middleware);
      const calledWith: any = func.mock.calls[0][0];
      expect(calledWith.path.id.value).toEqual('bob');
    });

    it('Should should return 404 response if path not found', async () => {
      middleware.requestDetail.url = '/ping';
      middleware.requestDetail.method = 'GET';
      api.build();

      await Api.handleRequest(api, middleware);
      expect(middleware.sendResponse).toBeCalledWith(
        HttpErrors[404],
        404,
        'text/plain'
      );
    });

    it('Should call the middleware sendResponse function', async () => {
      const func = async (apiRequest: ApiRequest) => {
        await apiRequest.send('test', 200, '');
      };
      middleware.requestDetail.url = '/';
      middleware.requestDetail.method = 'GET';
      api.endpoints.add('home', '/', ['GET']);
      api.controllers.add('home', 'GET', func);
      api.build();
      await Api.handleRequest(api, middleware);
      expect(middleware.sendResponse).toBeCalled();
    });

    it('Should call the middleware sendResponse function with custom headers', async () => {
      const func = async (apiRequest: ApiRequest) => {
        await apiRequest.send('test', 200, '', { contentLength: '0' });
      };
      middleware.requestDetail.url = '/';
      middleware.requestDetail.method = 'GET';
      api.endpoints.add('home', '/', ['GET']);
      api.controllers.add('home', 'GET', func);
      api.build();
      await Api.handleRequest(api, middleware);
      expect(middleware.sendResponse).toBeCalledWith(
        'test',
        200,
        'text/plain',
        { contentlength: '0' }
      );
    });

    it('Should should error if customError and path not found', async () => {
      api = new Api({ custom404: true });
      middleware.requestDetail.url = '/ping';
      middleware.requestDetail.method = 'GET';
      api.build();
      let error: any;
      try {
        await Api.handleRequest(api, middleware);
      } catch (ex) {
        error = ex;
      }
      expect(error.errorCode).toEqual(RotiroErrorCode.PathNotFound.toString());
    });

    it('Applies the meta from middleware to api request', async () => {
      const func = jest.fn();
      middleware.requestDetail.url = '/ping';
      middleware.requestDetail.method = 'GET';
      middleware.requestDetail.meta = { name: 'test' };
      api.endpoints.add('ping', '/ping', ['GET']);
      api.controllers.add('ping', 'GET', func);
      api.build();

      await Api.handleRequest(api, middleware);
      expect(func.mock.calls[0][0].meta).toEqual({ name: 'test' });
    });

    it('Create empty meta object on api request if no meta', async () => {
      const func = jest.fn();
      middleware.requestDetail.url = '/ping';
      middleware.requestDetail.method = 'GET';
      api.endpoints.add('ping', '/ping', ['GET']);
      api.controllers.add('ping', 'GET', func);
      api.build();

      await Api.handleRequest(api, middleware);
      expect(func.mock.calls[0][0].meta).toEqual({});
    });

    it('Create empty meta object on api request if meta empty', async () => {
      const func = jest.fn();
      middleware.requestDetail.url = '/ping';
      middleware.requestDetail.method = 'GET';
      middleware.requestDetail.meta = {};
      api.endpoints.add('ping', '/ping', ['GET']);
      api.controllers.add('ping', 'GET', func);
      api.build();

      await Api.handleRequest(api, middleware);
      expect(func.mock.calls[0][0].meta).toEqual({});
    });
  });

  describe('Controller Errors', () => {
    let middleware: RotiroMiddleware;
    let api: Api;
    beforeEach(() => {
      api = new Api();
      api.endpoints.add('ping', '/ping', ['GET']);
      middleware = {
        sendResponse: jest.fn(),
        requestDetail: {
          url: '/ping',
          method: 'GET',
          headers: {}
        }
      };
    });

    it('Return a 500 error', async () => {
      const func = jest.fn();
      func.mockImplementation(() => {
        throw createError(ErrorCodes.OriginalRequestNotValid);
      });

      api.controllers.add('ping', 'GET', func);
      api.build();
      await Api.handleRequest(api, middleware);
      expect(middleware.sendResponse).toBeCalledWith(
        'Original request not valid',
        500,
        'text/plain'
      );
    });

    it('Return a 500 error with generic answer', async () => {
      const func = jest.fn();
      func.mockImplementation(() => {
        throw createError(73);
      });

      api.controllers.add('ping', 'GET', func);
      api.build();
      await Api.handleRequest(api, middleware);
      expect(middleware.sendResponse).toBeCalledWith(
        HttpErrors[500],
        500,
        'text/plain'
      );
    });

    it('Return a custom error with a status', async () => {
      const func = jest.fn();
      func.mockImplementation(() => {
        throw new RotiroErrorResponse('Custom message', 400);
      });

      api.controllers.add('ping', 'GET', func);
      api.build();
      await Api.handleRequest(api, middleware);
      expect(middleware.sendResponse).toBeCalledWith(
        'Custom message',
        400,
        'text/plain'
      );
    });

    it('Return a custom error with a content body', async () => {
      const func = jest.fn();
      func.mockImplementation(() => {
        throw new RotiroErrorResponse('', 400, { name: 'error' });
      });

      api.controllers.add('ping', 'GET', func);
      api.build();
      await Api.handleRequest(api, middleware);
      expect(middleware.sendResponse).toBeCalledWith(
        { name: 'error' },
        400,
        'application/json'
      );
    });

    it('Return a custom error with a status message as body', async () => {
      const func = jest.fn();
      func.mockImplementation(() => {
        throw new RotiroErrorResponse('', 400);
      });

      api.controllers.add('ping', 'GET', func);
      api.build();
      await Api.handleRequest(api, middleware);
      expect(middleware.sendResponse).toBeCalledWith(
        HttpErrors[400],
        400,
        'text/plain'
      );
    });

    it('Return a custom error with the default error message', async () => {
      const func = jest.fn();
      func.mockImplementation(() => {
        throw new RotiroErrorResponse('', 499);
      });

      api.controllers.add('ping', 'GET', func);
      api.build();
      await Api.handleRequest(api, middleware);
      expect(middleware.sendResponse).toBeCalledWith(
        'Api Error',
        499,
        'text/plain'
      );
    });
  });

  describe('Authentication', () => {
    let middleware: RotiroMiddleware;
    let api: Api;
    let controllerFunc: any = null;

    beforeEach(() => {
      api = new Api();
      controllerFunc = jest.fn();
      middleware = {
        sendResponse: jest.fn(),
        requestDetail: {
          url: '/ping',
          method: 'GET',
          headers: {}
        }
      };
      const authFunc: AuthenticatorFunc = async (apiRequest) => {
        return apiRequest.routeName === 'ping';
      };

      api.authenticators.add('authToken', authFunc);
    });

    it('Should authenticate an endpoint request', async () => {
      api.endpoints.add('ping', '/ping', { GET: { auth: 'authToken' } });
      api.controllers.add('ping', 'GET', controllerFunc);
      api.build();
      await Api.handleRequest(api, middleware);

      const calledWith: any = controllerFunc.mock.calls[0][0];
      expect(calledWith.authenticated).toEqual(true);
    });

    it('Should return 401 status if not authenticated', async () => {
      api.endpoints.add('pingy', '/ping', { GET: { auth: 'authToken' } });
      api.controllers.add('pingy', 'GET', controllerFunc);
      api.build();

      await Api.handleRequest(api, middleware);

      expect(middleware.sendResponse).toBeCalledWith(
        HttpErrors[401],
        401,
        'text/plain'
      );
    });

    it('Should not return 401 status if not authenticated with handleAuthFail set', async () => {
      api.endpoints.add('pingy', '/ping', {
        GET: { auth: 'authToken', handleAuthFail: true }
      });
      api.controllers.add('pingy', 'GET', controllerFunc);
      api.build();

      await Api.handleRequest(api, middleware);
      const calledWith: any = controllerFunc.mock.calls[0][0];
      expect(calledWith.handleAuthFail).toBeFalsy();
      expect(middleware.sendResponse).not.toBeCalledWith(
        HttpErrors[401],
        401,
        'text/plain'
      );
    });
  });

  describe('Middlewares', () => {
    let middleware: RotiroMiddleware;
    let api: Api;
    beforeEach(() => {
      Logger.logger.error = jest.fn();
      api = new Api();
      middleware = {
        sendResponse: jest.fn(),
        requestDetail: {
          url: '/ping',
          method: 'GET',
          headers: {}
        }
      };
    });

    it('Logs error if invalid middleware', async () => {
      const func = async (apiRequest: ApiRequest) => {
        await apiRequest.send('test', 200, '', { contentLength: '0' });
      };
      api.endpoints.add('ping', '/ping', ['GET']);
      api.controllers.add('ping', 'GET', func);
      api.use(undefined as any);
      api.build();

      await Api.handleRequest(api, middleware);
      /*
      * The actual error returned appears to change depending on environment
      * Error calling middleware: Cannot read properties of undefined (reading 'call')
      * Error calling middleware: Cannot read property 'call' of undefined
      * Test the call rather than the actual message
      * */

      expect(Logger.logger.error).toBeCalledTimes(2);
      expect(
        (Logger.logger.error as any).mock.calls[0][0].startsWith(
          'Error calling middleware:'
        )
      ).toEqual(true);
    });

    it('Updates meta based on middleware', async () => {
      const middlewareFunc: RotiroMiddlewareFunc = (
        apiRequest: ApiRequest,
        apiResponse: ApiResponse
      ) => {
        if (typeof apiResponse === 'undefined') {
          // only apply if this pre controller function
          if (!apiRequest.meta) {
            apiRequest.meta = {};
          }
          apiRequest.meta.something = true;
        }
      };
      let meta: any;
      const func = async (apiRequest: ApiRequest) => {
        await apiRequest.send('test', 200, '', { contentLength: '0' });
        meta = apiRequest.meta;
      };
      api.endpoints.add('ping', '/ping', ['GET']);
      api.controllers.add('ping', 'GET', func);
      api.use(middlewareFunc);
      api.build();

      await Api.handleRequest(api, middleware);
      expect(meta.something).toEqual(true);
    });

    it('Updates response header with middleware', async () => {
      const middlewareFunc: RotiroMiddlewareFunc = (
        apiRequest: ApiRequest,
        responseDetail: ApiResponse
      ) => {
        responseDetail.headers.somethingNew = 'hello';
        responseDetail.contentType = 'something/different';
      };
      const func = async (apiRequest: ApiRequest) => {
        await apiRequest.send('test', 200, '', { contentLength: '0' });
      };
      api.endpoints.add('ping', '/ping', ['GET']);
      api.controllers.add('ping', 'GET', func);
      api.use(middlewareFunc);
      api.build();

      await Api.handleRequest(api, middleware);
      expect(middleware.sendResponse).toBeCalledWith(
        'test',
        200,
        'something/different',
        { contentlength: '0', somethingNew: 'hello' }
      );
    });
  });
});
