import amqplib, { Channel, Connection, ConsumeMessage, Options } from 'amqplib';
import { Ampq } from './Ampq';

export class BaseAmpq implements Ampq {
  protected connection: Connection | null;
  protected channel: Channel | null;
  protected connectionOptions: Options.Connect;
  protected socketOptions: any;
  protected prefetch?: number;

  constructor(connectionOptions: Options.Connect, socketOptions: any, prefetch?: number) {
    this.connection = null;
    this.channel = null;

    this.connectionOptions = connectionOptions;
    this.socketOptions = socketOptions;
    this.prefetch = prefetch;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqplib.connect(this.connectionOptions, this.socketOptions);
      this.channel = await this.connection.createChannel();
      if (this.prefetch) {
        this.channel.prefetch(this.prefetch);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  disconnect(): void {
    if (this.channel) {
      this.channel.close();
    }

    if (this.connection) {
      this.connection.close();
    }
  }

  fromPayload(payload: Object): Buffer {
    return Buffer.from(JSON.stringify(payload));
  }

  toPayload(message: ConsumeMessage): Object {
    try {
      return JSON.parse(message.content.toString());
    } catch (error) {
      return message.content.toString();
    }
  }

  acknowledge(message: ConsumeMessage): void {
    if (!this.channel) {
      return;
    }

    this.channel.ack(message);
  }

  getInfo = (): string => {
    return `${this.connectionOptions.hostname}/${this.connectionOptions.vhost}`;
  };
}
