import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { ImageUploadsClient } from '@modules/product/infrastructure/store/image-uploads-client';
import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Command, Console } from 'nestjs-console';

@Console()
export class FixProductImageCLI {
  private readonly logger: Logger = new Logger(FixProductImageCLI.name);

  constructor(
    private prisma: PrismaStoreClient,
    private imageUploadClient: ImageUploadsClient,
  ) {}

  @Command({
    command: 'fixProductImages',
    options: [
      {
        flags: '-l, --limit <limit>',
        required: false,
        description: 'limit number of images to deal',
      },
    ],
  })
  async fixProductImages({ limit = 2000 }: { limit: number }): Promise<void> {
    const imagesToFix = await this.prisma.$queryRawUnsafe<
      { id: string; url: string }[]
    >(`SELECT id, url FROM medusa.image
		WHERE metadata->'formatFixed' IS NULL
		LIMIT ${limit}`);
    this.logger.log(`Found ${imagesToFix.length} products without images`);

    for (const { id, url } of imagesToFix) {
      try {
        this.logger.log(`Treating image ${id}`);
        const result = url.match(
          /https:\/\/barooders-medusa-[a-z]*\.s3\.amazonaws\.com\/products\/([a-f0-9-]*)\.png$/,
        );
        const fileName = result?.[1] ?? randomUUID();

        await this.imageUploadClient.multiFormatUploadFromUrl({
          fileName,
          url,
        });

        await this.prisma.$executeRawUnsafe(
          `UPDATE medusa.image SET metadata = '{"formatFixed": true}' WHERE id = '${id}';`,
        );
      } catch (e) {
        const error = e as { message: string };
        this.logger.error(error.message);
        continue;
      }
    }
  }
}
