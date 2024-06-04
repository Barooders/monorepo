import envConfig from '@config/env/env.config';
import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk'; // eslint-disable-line import/named
import axios from 'axios';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

type Size = 'thumbnail' | 'small' | 'medium' | 'large';
const SIZE_CONFIG: Record<Size, { width: number; height: number }> = {
  thumbnail: {
    width: 250,
    height: 250,
  },
  small: {
    width: 500,
    height: 500,
  },
  medium: {
    width: 800,
    height: 800,
  },
  large: {
    width: 1000,
    height: 1000,
  },
};

@Injectable()
export class ImageUploadsClient {
  private readonly logger: Logger = new Logger(ImageUploadsClient.name);
  private readonly PATH_PREFIX = 'products';

  private readonly s3 = new S3({
    apiVersion: '2006-03-01',
    accessKeyId: envConfig.externalServices.s3.accessKeyId,
    secretAccessKey: envConfig.externalServices.s3.secretAccessKey,
  });

  async uploadImages(urls: string[]): Promise<string[]> {
    const uploadedImageUrls = [];
    for (const url of urls) {
      const fileName = randomUUID();
      await this.multiFormatUploadFromUrl({ url, fileName });

      this.logger.debug(`${url} uploaded`);
      uploadedImageUrls.push(this.publicUrl(fileName));
    }

    return uploadedImageUrls;
  }

  async uploadBase64Image(base64Content: string): Promise<string> {
    const fileName = randomUUID();
    await this.multiFormatUploadFromBase64Content({
      content: base64Content,
      fileName,
    });

    return this.publicUrl(fileName);
  }

  private async multiFormatUploadFromUrl({
    url,
    fileName,
  }: {
    url: string;
    fileName: string;
  }): Promise<string[]> {
    const input = (
      await axios({
        url,
        responseType: 'arraybuffer',
      })
    ).data as Buffer;

    return await this.multiFormatUploadFromBuffer({ buffer: input, fileName });
  }

  private async multiFormatUploadFromBase64Content({
    content,
    fileName,
  }: {
    content: string;
    fileName: string;
  }) {
    const buffer = Buffer.from(content, 'base64');
    return await this.multiFormatUploadFromBuffer({ buffer, fileName });
  }

  private async multiFormatUploadFromBuffer({
    buffer,
    fileName,
  }: {
    buffer: Buffer;
    fileName: string;
  }) {
    const results = await Promise.all([
      (async () => {
        const originalOutput = await sharp(buffer).png().toBuffer();
        return this.publicUrl(
          (await this.uploadFile(`${fileName}.png`, originalOutput)).Key,
        );
      })(),
      ...Object.keys(SIZE_CONFIG).map(async (size) => {
        const { width, height } = SIZE_CONFIG[size as Size];
        const output = await sharp(buffer)
          .resize(width, height, {
            fit: 'contain',
          })
          .png()
          .toBuffer();

        return this.publicUrl(
          (await this.uploadFile(`${fileName}-${size}.png`, output)).Key,
        );
      }),
    ]);

    return results;
  }

  private async uploadFile(fileName: string, content: Buffer) {
    const params = {
      Bucket: envConfig.externalServices.s3.bucketName,
      Key: `${this.PATH_PREFIX}/${fileName}`,
      Body: content,
    };

    const result = await this.s3
      .upload(params, function (err: unknown, data: unknown) {
        if (err != null) {
          throw err;
        }
        return data;
      })
      .promise();

    return result;
  }

  private publicUrl(fileName: string) {
    return `https://${envConfig.externalServices.s3.bucketName}.s3.amazonaws.com/${this.PATH_PREFIX}/${fileName}.png`;
  }
}
