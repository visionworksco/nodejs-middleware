import { Options } from 'amqplib';
import { AmpqExchangeType } from './AmpqExchangeType';
import { AmpqRouting } from './AmpqRouting';

export class AmpqTopic extends AmpqRouting {
  protected exchangeType: AmpqExchangeType;

  constructor(connectionOptions: Options.Connect, socketOptions: any, prefetch?: number) {
    super(connectionOptions, socketOptions, prefetch);
    this.exchangeType = 'topic';
  }
}
