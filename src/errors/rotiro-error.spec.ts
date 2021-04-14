import { RotiroError } from './rotiro-error';

describe('errors/rotiro-error', () => {
  it('Creates a basic Rotiro Error', () => {
    const message = 'An Error';
    const error: any = new RotiroError(message);
    expect(error.name).toEqual('RotiroError');
    expect(error.message).toEqual(message);
  });

  it('Creates an Error with content', () => {
    const content = { data: 'some data' };
    const message = 'An Error';
    const error: any = new RotiroError(message, content);

    expect(error.content).toEqual(content);
  });

  it('Creates an Error with a code', () => {
    const errorCode = 'ERR203';
    const message = 'An Error';
    const error: any = new RotiroError(message, undefined, errorCode);

    expect(error.errorCode).toEqual(errorCode);
  });

  it('Creates an Error with a numeric code', () => {
    const message = 'An Error';
    const error: any = new RotiroError(message, undefined, 42 as any);

    expect(error.errorCode).toEqual('42');
  });
});
