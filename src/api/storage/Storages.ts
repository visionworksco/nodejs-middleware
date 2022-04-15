import { Storage } from './Storage';

export class Storages {
  private storages: Storage[] = [];

  constructor(...storages: Storage[]) {
    for (const storage of storages) {
      this.register(storage);
    }
  }

  private register(storage: Storage) {
    this.storages.push(storage);
  }

  async connect(): Promise<void> {
    try {
      for (const storage of this.storages) {
        await storage.connect();
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      for (const storage of this.storages) {
        await storage.disconnect();
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
