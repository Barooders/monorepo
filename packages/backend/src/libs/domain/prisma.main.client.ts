import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@generated/main-client';
export * from '@generated/main-client';

@Injectable()
export class PrismaMainClient extends PrismaClient implements OnModuleInit {
  constructor() {
    // For full prisma logs: ['query', 'info', 'warn', 'error']
    super({ log: ['error'] });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
