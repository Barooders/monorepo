import { Injectable, Logger } from '@nestjs/common';
import { Mutex, MutexInterface } from 'async-mutex';

@Injectable()
export class MutexService {
  private readonly logger = new Logger(MutexService.name);
  //TODO: use infra layer to store locks as we could use Redis or other distributed storage
  private locks: Map<string, MutexInterface>;

  constructor() {
    this.locks = new Map();
  }

  public async runCallbackInSingleThread(
    entityId: string,
    callback: () => Promise<void>,
  ): Promise<void> {
    if (!this.locks.has(entityId)) {
      this.logger.debug(`Creating lock for ${entityId}`);
      this.locks.set(entityId, new Mutex());
    }

    const lock = this.locks.get(entityId);

    if (!lock) {
      throw new Error(`Lock for ${entityId} not found`);
    }

    const release = await lock.acquire();

    try {
      await callback();
      release();
      this.logger.debug(`Released lock for ${entityId}`);
    } catch (error) {
      release();
      this.logger.debug(`Released lock for ${entityId}`);
      throw error;
    }
  }
}
