import { RotiroErrorResponse } from './rotiro-error-response';

describe('errors/rotiro-error', () => {
  const status: number = 400;

  it('Creates a basic Rotiro Error', () => {
    const message = 'An Error';
    const error: any = new RotiroErrorResponse(message, status);
    expect(error.name).toEqual('RotiroErrorResponse');
    expect(error.message).toEqual(message);
    expect(error.status).toEqual(status);
  });

  it('Creates an Error with content', () => {
    const content = { data: 'some data' };
    const message = 'An Error';
    const error: any = new RotiroErrorResponse(message, status, content);

    expect(error.content).toEqual(content);
  });

  it('Creates an Error with a code', () => {
    const errorCode = 'ERR203';
    const message = 'An Error';
    const error: any = new RotiroErrorResponse(
      message,
      status,
      undefined,
      errorCode
    );

    expect(error.errorCode).toEqual(errorCode);
  });
});
