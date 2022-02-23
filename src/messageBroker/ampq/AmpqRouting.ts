import { ConsumeMessage, Options } from 'amqplib';
import { AmpqExchangeType } from './AmpqExchangeType';
import { BaseAmpq } from './BaseAmpq';

export class AmpqRouting extends BaseAmpq {
  protected durable: boolean;
  protected acknowledgment: boolean;
  protected exchangeType: AmpqExchangeType;
  protected exclusive: boolean;

  constructor(connectionOptions: Options.Connect, socketOptions: any, prefetch?: number) {
    super(connectionOptions, socketOptions, prefetch);
    this.durable = false;
    this.acknowledgment = true;
    this.exchangeType = 'direct';
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

  produce(exchangeName: string, routingKey: string, payload: Object): boolean {
    if (!this.channel) {
      return false;
    }

    const messageUpdated = this.fromPayload(payload);
    return this.channel.publish(exchangeName, routingKey, messageUpdated);
  }

  async consume(
    exchangeName: string,
    routingKeys: string[],
    onConsumeMessage: (msg: ConsumeMessage | null) => void,
  ): Promise<void> {
    try {
      if (!this.channel) {
        return;
      }

      const response = await this.channel.assertQueue('', { exclusive: this.exclusive });
      const queueName = response.queue;

      routingKeys.forEach((routingkey) => {
        if (this.channel) {
          this.channel.bindQueue(queueName, exchangeName, routingkey);
        }
      });

      await this.channel.consume(queueName, onConsumeMessage, { noAck: !this.acknowledgment });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
