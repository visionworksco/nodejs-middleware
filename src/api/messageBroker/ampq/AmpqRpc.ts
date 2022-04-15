import { ConsumeMessage, Options } from 'amqplib';
import { BaseAmpq } from './BaseAmpq';

export class AmpqRpc extends BaseAmpq {
  protected durable: boolean;
  protected acknowledgment: boolean;
  protected exclusive: boolean;

  constructor(connectionOptions: Options.Connect, socketOptions: any, prefetch?: number) {
    super(connectionOptions, socketOptions, prefetch);
    this.durable = false;
    this.acknowledgment = true;
    this.exclusive = true;
  }

  async registerQueues(queueNames: string[]): Promise<void> {
    try {
      for (const queueName of queueNames) {
        await this.assertQueue(queueName);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async assertQueue(queueName: string): Promise<void> {
    try {
      if (!this.channel) {
        return;
      }

      await this.channel.assertQueue(queueName, { durable: this.durable });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async produce(
    queueName: string,
    correlationId: string,
    payload: Object,
    onClientConsumeMessageFromServer: (msg: ConsumeMessage | null) => void,
  ): Promise<boolean> {
    try {
      if (!this.channel) {
        return false;
      }

      const response = await this.channel.assertQueue('', { exclusive: this.exclusive });
      const generatedQueueName = response.queue;

      await this.channel.consume(generatedQueueName, onClientConsumeMessageFromServer, {
        noAck: true,
      });

      const messageUpdated = this.fromPayload(payload);
      return this.channel.sendToQueue(queueName, messageUpdated, {
        correlationId,
        replyTo: generatedQueueName,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async consume(
    queueName: string,
    onServerConsumeMessageFromClient: (msg: ConsumeMessage | null) => void,
  ): Promise<void> {
    try {
      if (!this.channel) {
        return;
      }

      await this.channel.consume(queueName, onServerConsumeMessageFromClient, {
        noAck: !this.acknowledgment,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  replyToClient(replyToQueueName: string, correlationId: string, payload: Object): boolean {
    if (!this.channel) {
      return false;
    }

    const messageUpdated = this.fromPayload(payload);
    return this.channel.sendToQueue(replyToQueueName, messageUpdated, { correlationId });
  }
}
