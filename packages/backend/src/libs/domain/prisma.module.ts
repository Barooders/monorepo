import { Module } from '@nestjs/common';
import { PrismaMainClient } from './prisma.main.client';
import { PrismaStoreClient } from './prisma.store.client';

@Module({
  providers: [PrismaMainClient, PrismaStoreClient],
  exports: [PrismaMainClient, PrismaStoreClient],
})
export class PrismaModule {}
