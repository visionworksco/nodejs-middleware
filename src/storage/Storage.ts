export interface Storage {
  connect(): Promise<any>;
  disconnect(): Promise<void>;
}
