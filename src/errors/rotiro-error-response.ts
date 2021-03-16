import { RotiroError } from './rotiro-error';

export class RotiroErrorResponse extends RotiroError {
  public readonly status: number;

  constructor(
    message: string,
    status: number,
    content?: any,
    errorCode?: string
  ) {
    super(message, content, errorCode);
    this.status = status;
  }

  public get name(): string {
    return 'RotiroErrorResponse';
  }
}
