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

  static toTimeStringFromSeconds(seconds: number): string {
    return moment.utc(seconds * 1000).format('HH:mm:ss');
  }

  static toSecondsFromTimeString(timeString: number[]): number {
    return timeString[0] * 60 * 60 + timeString[1] * 60 + timeString[2];
  }

  static defaultTimeStr = (): string => {
    return '00:00:00';
  };

  static fromNow(date: Date): string {
    return moment(date).fromNow();
  }

  static millisecondsFromMinutes = (minutes: number): number => {
    return 1000 * 60 * minutes;
  };

  static hoursInSeconds(hours: number): number {
    return hours * 60 * 60;
  }
}
