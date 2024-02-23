import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { ConfigKeys, ConfigType } from './types';
@Injectable()
export class ConfigStoreService {
  constructor(private prisma: PrismaMainClient) {}

  async getConfig<C extends ConfigType>(key: ConfigKeys): Promise<C> {
    const config = await this.prisma.config.findFirst({
      where: { key },
    });

    return (config?.value ?? null) as C;
  }

  async updateConfig<C extends ConfigType>(
    key: ConfigKeys,
    newConfig: Partial<C>,
  ): Promise<void> {
    const currentConfig = await this.getConfig<C>(key);
    const payload = {
      key,
      value: {
        ...currentConfig,
        ...newConfig,
      },
    };
    await this.prisma.config.upsert({
      where: { key },
      create: payload,
      update: payload,
    });
  }
}
