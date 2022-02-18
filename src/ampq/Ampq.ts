import { ConsumeMessage } from 'amqplib';

export interface Ampq {
  connect(): Promise<void>;
  disconnect(): void;
  acknowledge(message: ConsumeMessage): void;
}
