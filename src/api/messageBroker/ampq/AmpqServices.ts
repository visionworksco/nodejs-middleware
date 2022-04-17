import { AmpqService } from './AmpqService';

export class AmpqServices {
  private services: AmpqService[] = [];

  constructor(...services: (AmpqService | null)[]) {
    for (const service of services) {
      service && this.register(service);
    }
  }

  get size(): number {
    return this.services.length;
  }

  async start(): Promise<void> {
    try {
      for (const service of this.services) {
        await service.start();
        await service.consume();
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  stop(): void {
    for (const storage of this.services) {
      storage.stop();
    }
  }

  private register(service: AmpqService) {
    this.services.push(service);
  }
}
