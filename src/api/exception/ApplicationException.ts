export class ApplicationException extends Error {
  readonly status: number;
  readonly message: string;
  readonly name: string;

  constructor(status: number, message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationException);
    }

    this.name = 'ApplicationError';
    this.status = status;
    this.message = message;
  }
}
