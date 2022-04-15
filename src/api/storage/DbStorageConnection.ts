export interface DbStorageConnection {
  host: string;
  database: string;
  port: number;
  user: string;
  password: string;
  getInfo(): string;
}
