import { MappingKey } from '@config/vendor/types';
import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { FirstProductMapped } from './tag.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaMainClient) {}

  async getOrCreateCategory(
    categoryKey: string,
    mappingKey: MappingKey,
    categoryName?: string,
    metadata?: FirstProductMapped,
  ): Promise<string | null> {
    const trimmedKey = categoryKey.trim();
    const existingCategory =
      await this.prisma.vendorProCategoryMapping.findMany({
        where: { externalCategoryId: trimmedKey, mappingKey },
      });
    if (existingCategory.length === 0) {
      await this.prisma.vendorProCategoryMapping.create({
        data: {
          externalCategoryId: trimmedKey,
          externalCategoryName: categoryName,
          mappingKey,
          metadata,
        },
      });
    }
    if (
      existingCategory.length > 0 &&
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      existingCategory[0].internalCategoryName
    ) {
      return existingCategory[0].internalCategoryName.trim();
    }
    return null;
  }
}
