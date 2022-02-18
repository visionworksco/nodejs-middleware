import moment from 'moment';

type DateFormat = 'DD MMM YYYY' | 'YYYY-MM-DD' | 'DD MMM';
type TimeFormat = 'HH:mm' | 'HH:mm:ss';
type DateTimeFormat =
  | 'DD MMM YYYY HH:mm'
  | 'YYYY-MM-DD HH:mm'
  | 'YYYY-MM-DD HH:mm Z'
  | 'YYYY-MM-DD HH:mm:ss'
  | 'HH:mm:ss YYYY-MM-DD'
  | 'YYYY-MM-DDTHH:mm:ssZ';

export type DateFormatOptions = DateFormat | TimeFormat | DateTimeFormat;

export class DateUtils {
  static fromISOString(isoDate: string): Date {
    return new Date(isoDate);
  }

  static toISOString(date: Date): string {
    return date.toJSON();
  }

  static fromMilliseconds(ms: number): Date {
    return new Date(ms);
  }

  static toMilliseconds(date: Date): number {
    return date.getTime();
  }

  static fromString(dateStr: string, options: DateFormatOptions): Date {
    return moment(dateStr, options).toDate();
  }

  static toString(date: Date, options: DateFormatOptions): string {
    return moment(date).format(options);
  }

  static millisecondsFromMinutes = (minutes: number): number => {
    return 1000 * 60 * minutes;
  };

  static hoursInSeconds(hours: number): number {
    return hours * 60 * 60;
  }
}
