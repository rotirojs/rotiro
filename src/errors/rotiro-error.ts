export class RotiroError extends Error {
  public readonly errorCode: string | undefined;
  public readonly content: any | undefined;

  constructor(message: string, content?: any, errorCode?: string) {
    super(message);
    if (errorCode && typeof (errorCode as any) !== 'string') {
      errorCode = errorCode.toString();
    }

    this.content = content;
    this.errorCode = errorCode;
  }

  public get name(): string {
    return 'RotiroError';
  }
}
