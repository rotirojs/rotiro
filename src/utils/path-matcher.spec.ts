import { pathToRegexp } from 'path-to-regexp';
import { getRouteName } from './path-matcher';

describe('utils/path-matcher', () => {
  describe('getRouteName', () => {
    const keys: any[] = [];
    const pattern1: any = pathToRegexp('/user/:userId/:frankName', keys);
    const pattern2: any = pathToRegexp('/user/bill', keys);
    const pattern3: any = pathToRegexp('/user/:userId', keys);

    const paths = [
      { routeName: 'pattern1', pattern: pattern1 },
      { routeName: 'pattern2', pattern: pattern2 },
      { routeName: 'pattern3', pattern: pattern3 }
    ];

    it('Should match pattern 1', () => {
      expect(getRouteName('/user/dave/bob', paths)).toEqual('pattern1');
    });

    it('Should match pattern 2', () => {
      expect(getRouteName('/user/bill', paths)).toEqual('pattern2');
    });

    it('Should match pattern 3', () => {
      expect(getRouteName('/user/dave', paths)).toEqual('pattern3');
    });

    it('Should not find a match', () => {
      expect(getRouteName('/user/', paths)).toEqual('');
    });
  });
});
