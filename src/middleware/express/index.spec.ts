import { Api } from '../../classes';
import { router } from './index';

jest.mock('../../classes');

describe('middleware/express', () => {
  let api: Api;
  beforeEach(() => {
    Api.handleRequest = jest.fn();
    api = new Api();
  });

  describe('router', () => {
    it('Return a middleware handler', () => {
      const middleware = router(api);
      expect(typeof middleware).toEqual('function');
    });

    it('Call api handleRequest', async () => {
      const request: any = {};
      const response: any = {};
      const middleware = router(api);
      await middleware(request, response);

      expect(Api.handleRequest).toBeCalled();
    });
  });
});
