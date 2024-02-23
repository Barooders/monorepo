import { MappingKey } from '@config/vendor/types';
import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import { IDescriptionParser } from '@modules/pro-vendor/domain/ports/description.parser';
import { Injectable, Logger } from '@nestjs/common';

export type FirstProductMapped = { externalId: string; title: string };

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    private prisma: PrismaMainClient,
    private descriptionParser: IDescriptionParser,
  ) {}

  async getOrCreateTag(
    externalTagName: string,
    externalTagValue: string,
    externalTagKey: string,
    mappingKey: MappingKey,
    metadata: FirstProductMapped,
  ): Promise<string[]> {
    const trimmedTagKey = externalTagKey.trim();
    const trimmedTagValueKey = (externalTagKey + '-' + externalTagValue).trim();

    const dbTagName = await this.prisma.vendorProTagMapping.findMany({
      where: { externalTagId: trimmedTagKey, mappingKey },
    });

    const dbTagValue = await this.prisma.vendorProTagValueMapping.findMany({
      where: {
        externalTagValueId: trimmedTagValueKey,
        mappingKey,
      },
    });

    if (dbTagValue.length === 0) {
      const newTagValue = {
        externalTagValueId: trimmedTagValueKey,
        externalTagName: externalTagName,
        externalTagValue: externalTagValue,
        mappingKey,
        metadata,
      };

      await this.prisma.vendorProTagValueMapping.create({
        data: newTagValue,
      });
      this.logger.warn(`Created new tag value: ${jsonStringify(newTagValue)}`);
    }

    if (dbTagName.length === 0) {
      const newTag = {
        externalTagId: trimmedTagKey,
        externalTagName: externalTagName,
        mappingKey,
      };

      await this.prisma.vendorProTagMapping.create({
        data: newTag,
      });
      this.logger.warn(`Created new tag: ${jsonStringify(newTag)}`);
    }

    const internalTagName = dbTagName[0]?.internalTagName;

    if (!internalTagName) return [];

    if (dbTagName[0].useDefaultTagValues)
      return [`${internalTagName}:${externalTagValue}`];

    const internalTagValue = dbTagValue[0]?.internalTagValue;

    if (!internalTagValue) return [];

    return internalTagValue.split(';').map((value) => {
      return `${internalTagName}:${value}`;
    });
  }

  async parseTextAndCreateTags(
    desiredParsedKeys: string[],
    text: string,
    mappingKey: MappingKey,
    metadata: FirstProductMapped,
  ): Promise<string[]> {
    const technicalCharacteristicsObject =
      await this.descriptionParser.getTechnicalCharacteristicsFromText(
        desiredParsedKeys,
        text,
      );
    const tags = [];

    for (const [key, value] of Object.entries(technicalCharacteristicsObject)) {
      const newTag = await this.getOrCreateTag(
        key,
        typeof value === 'string' ? value : jsonStringify(value),
        key,
        mappingKey,
        metadata,
      );

      if (newTag) tags.push(...newTag);
    }

    return tags;
  }
}
