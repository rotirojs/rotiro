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
      expect(() => {
        getAuthToken(request, tokenName);
      }).toThrow('Invalid token name');
    });

    it('Throw error if no request', () => {
      const tokenName: string = 'Authorization';
      const request: any = undefined;
      expect(() => {
        getAuthToken(request, tokenName);
      }).toThrow('Invalid request');
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
