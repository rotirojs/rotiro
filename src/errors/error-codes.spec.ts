import { createError, ErrorCodes } from './error-codes';
import { RotiroError } from './rotiro-error';

describe('errors/error-codes', () => {
  it('Create an error', () => {
    const error: RotiroError = createError(ErrorCodes.PathNotFound);

    expect(error.errorCode).toEqual(101);
    expect(error.message).toEqual('Path not found');
    expect(error.content).toEqual(undefined);
  });

  it('Create an error with content', () => {
    const errorContent: any = { data: 'error' };
    const error: RotiroError = createError(ErrorCodes.PathNotFound, errorContent);

    expect(error.content).toEqual(errorContent);
  });
});
