import { RotiroError } from '../errors';
import { createError, ErrorCodes } from '../errors/error-codes';
import { getAuthToken } from './auth-token';

describe('utils/auth-token', () => {
  let headers: Record<string, string>;
  describe('getAuthToken', () => {
    beforeEach(() => {
      headers = { authorization: 'token' };
    });
    it('Extract token from request headers', () => {
      const tokenName: string = 'Authorization';
      expect(getAuthToken(tokenName, headers)).toEqual('token');
    });

    it('Extract token regardless of case from request headers', () => {
      const tokenName: string = 'authorization';
      expect(getAuthToken(tokenName, headers)).toEqual('token');
    });

    it('Throw error if not token name', () => {
      const tokenName: string = '';

      let error: RotiroError | undefined;
      try {
        getAuthToken(tokenName, headers);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.InvalidTokenName);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('Throw error if no headers', () => {
      const tokenName: string = 'Authorization';

      let error: RotiroError | undefined;
      try {
        getAuthToken(tokenName, undefined as any);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.InvalidRequest);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('Return empty string if token not found', () => {
      const tokenName: string = 'Authorization';
      expect(getAuthToken(tokenName, { authtoken: 'token' })).toEqual('');
    });

    it('Extract token from request query', () => {
      const tokenName: string = 'Authorization';
      expect(
        getAuthToken(tokenName, {}, {
          authorization: { value: 'token' }
        } as any)
      ).toEqual('token');
    });

    it('Extract token regardless of case from request query', () => {
      const tokenName: string = 'authorization';
      expect(
        getAuthToken(tokenName, {}, {
          Authorization: { value: 'token' }
        } as any)
      ).toEqual('token');
    });

    it('Return empty string if token not found on query', () => {
      const tokenName: string = 'Authorization';
      expect(getAuthToken(tokenName, {}, {})).toEqual('');
    });

    it('Return empty string if token not found on query containing other parameters', () => {
      const tokenName: string = 'Authorization';
      expect(
        getAuthToken(tokenName, { name: 'bob' }, {
          name: { value: 'bob' }
        } as any)
      ).toEqual('');
    });
  });
});
