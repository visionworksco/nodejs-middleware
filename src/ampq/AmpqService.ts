export interface AmpqService {
  start(): Promise<void>;
  stop(): void;
  consume(): Promise<void>;
  produce(message: any): Promise<void>;
}
