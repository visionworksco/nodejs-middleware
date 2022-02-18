export class Logger {
  static log(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  static error(...args: any[]): void {
    console.error(...args);
  }
}
