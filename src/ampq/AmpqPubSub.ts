import { ConsumeMessage, Options } from 'amqplib';
import { AmpqExchangeType } from './AmpqExchangeType';
import { BaseAmpq } from './BaseAmpq';

export class AmpqPubSub extends BaseAmpq {
  protected durable: boolean;
  protected acknowledgment: boolean;
  protected exchangeType: AmpqExchangeType;
  protected exclusive: boolean;

  constructor(connectionOptions: Options.Connect, socketOptions: any, prefetch?: number) {
    super(connectionOptions, socketOptions, prefetch);
    this.durable = false;
    this.acknowledgment = true;
    this.exchangeType = 'fanout';
    this.exclusive = true;
  }

  async registerExchange(exchangeName: string): Promise<void> {
    try {
      if (!this.channel) {
        return;
      }

      await this.channel.assertExchange(exchangeName, this.exchangeType, { durable: this.durable });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  produce(exchangeName: string, payload: Object): boolean {
    if (!this.channel) {
      return false;
    }

    const messageUpdated = this.fromPayload(payload);
    return this.channel.publish(exchangeName, '', messageUpdated);
  }

  async consume(
    exchangeName: string,
    onConsumeMessage: (msg: ConsumeMessage | null) => void,
  ): Promise<void> {
    try {
      if (!this.channel) {
        return;
      }

      const response = await this.channel.assertQueue('', { exclusive: this.exclusive });
      const queueName = response.queue;

      this.channel.bindQueue(queueName, exchangeName, '');

      await this.channel.consume(queueName, onConsumeMessage, { noAck: !this.acknowledgment });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
