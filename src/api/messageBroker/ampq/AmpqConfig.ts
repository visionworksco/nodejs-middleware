import { Options } from 'amqplib';
import { AmpqSocketOptions } from './AmpqSocketOptions';

export interface AmpqConfig {
  connectionOptions: Options.Connect;
  socketOptions: AmpqSocketOptions | undefined;
}
