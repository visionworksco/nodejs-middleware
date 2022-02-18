export class ExceptionLogger {
  static log(error: Error): void {
    console.error(error);
  }
}
