import { Logger } from '../log/Logger';
import { DbStorageConnection } from './DbStorageConnection';
import { DbStorageSetup } from './DbStorageSetup';
import { Storage } from './Storage';

export abstract class BaseDbStorageSetup implements DbStorageSetup {
  protected dbStorageConnection: DbStorageConnection;
  protected dbStorage: Storage | null = null;

  constructor(dbStorageConnection: DbStorageConnection) {
    this.dbStorageConnection = dbStorageConnection;
  }

  abstract create(): Promise<void>;

  abstract delete(): Promise<void>;

  protected async done(): Promise<void> {
    Logger.log(`[${this.dbStorageConnection.getInfo()}] setup done`);
    this.exit();
  }

  protected async exit(code?: number): Promise<void> {
    await this.disconnect();
    process.exit(code);
  }

  private async disconnect(): Promise<void> {
    if (this.dbStorage) {
      await this.dbStorage.disconnect();
    }
  }
}
