import { RotiroError } from '../errors';
import { createError, ErrorCodes } from '../errors/error-codes';
import { getAuthToken } from './auth-token';

describe('utils/auth-token', () => {
  describe('getAuthToken', () => {
    it('Extract token from request headers', () => {
      const tokenName: string = 'Authorization';
      const request: any = { headers: { Authorization: 'token' } };
      expect(getAuthToken(request, tokenName)).toEqual('token');
    });

    it('Extract token regardless of case from request headers', () => {
      const tokenName: string = 'authorization';
      const request: any = { headers: { Authorization: 'token' } };
      expect(getAuthToken(request, tokenName)).toEqual('token');
    });

    it('Throw error if not token name', () => {
      const tokenName: string = '';
      const request: any = { headers: { Authorization: 'token' } };

      let error: RotiroError | undefined;
      try {
        getAuthToken(request, tokenName);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.E115);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('Throw error if no request', () => {
      const tokenName: string = 'Authorization';
      const request: any = undefined;

      let error: RotiroError | undefined;
      try {
        getAuthToken(request, tokenName);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.E114);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('Return empty string if no headers', () => {
      const tokenName: string = 'Authorization';
      const request: any = {};
      expect(getAuthToken(request, tokenName)).toEqual('');
    });

    it('Return empty string if token not found', () => {
      const tokenName: string = 'Authorization';
      const request: any = { headers: { authToken: 'token' } };
      expect(getAuthToken(request, tokenName)).toEqual('');
    });

    it('Extract token from request query', () => {
      const tokenName: string = 'Authorization';
      const request: any = { query: { Authorization: 'token' } };
      expect(getAuthToken(request, tokenName)).toEqual('token');
    });

    it('Extract token regardless of case from request query', () => {
      const tokenName: string = 'authorization';
      const request: any = { query: { Authorization: 'token' } };
      expect(getAuthToken(request, tokenName)).toEqual('token');
    });

    it('Return empty string if token not found on query', () => {
      const tokenName: string = 'Authorization';
      const request: any = { query: { authToken: 'token' } };
      expect(getAuthToken(request, tokenName)).toEqual('');
    });
  });
});
