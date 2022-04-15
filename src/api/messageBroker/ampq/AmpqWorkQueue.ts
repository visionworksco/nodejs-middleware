import { ConsumeMessage, Options } from 'amqplib';
import { BaseAmpq } from './BaseAmpq';

export class AmpqWorkQueue extends BaseAmpq {
  protected durable: boolean;
  protected persistent: boolean;
  protected acknowledgment: boolean;

  constructor(connectionOptions: Options.Connect, socketOptions: any, prefetch?: number) {
    super(connectionOptions, socketOptions, prefetch);
    this.durable = true;
    this.persistent = true;
    this.acknowledgment = true;
  }

  async registerQueues(queueNames: string[], options?: Options.AssertQueue): Promise<void> {
    try {
      for (const queueName of queueNames) {
        await this.assertQueue(queueName, options);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async assertQueue(queueName: string, options?: Options.AssertQueue): Promise<void> {
    try {
      if (!this.channel) {
        return;
      }

      const optionsUpdated = {
        ...options,
        durable: this.durable,
      };

      await this.channel.assertQueue(queueName, optionsUpdated);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  produce(queueName: string, payload: Object): boolean {
    if (!this.channel) {
      return false;
    }

    const messageUpdated = this.fromPayload(payload);
    return this.channel.sendToQueue(queueName, messageUpdated, { persistent: this.persistent });
  }

  async consume(
    queueName: string,
    onConsumeMessage: (msg: ConsumeMessage | null) => void,
  ): Promise<void> {
    try {
      if (!this.channel) {
        return;
      }

      await this.channel.consume(queueName, onConsumeMessage, { noAck: !this.acknowledgment });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
