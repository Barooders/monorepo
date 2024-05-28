import envConfig from '@config/env/env.config';
import { IImageUploadsClient } from '@modules/product/domain/ports/image-uploads.client';
import { Injectable } from '@nestjs/common';
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
export class ImageUploadsClient implements IImageUploadsClient {
  private readonly PATH_PREFIX = 'products';

  private readonly s3 = new S3({
    apiVersion: '2006-03-01',
    accessKeyId: envConfig.externalServices.s3.accessKeyId,
    secretAccessKey: envConfig.externalServices.s3.secretAccessKey,
  });

  async uploadImages(urls: string[]): Promise<string[]> {
    return await Promise.all(
      urls.map(async (url) => {
        const fileName = randomUUID();
        await this.multiFormatUploadFromUrl({ url, fileName });

        return this.publicUrl(fileName);
      }),
    );
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

    const results = await Promise.all(
      Object.keys(SIZE_CONFIG).map(async (size) => {
        const { width, height } = SIZE_CONFIG[size as Size];
        const output = await sharp(input)
          .resize(width, height, {
            fit: 'contain',
          })
          .png()
          .toBuffer();

        return this.publicUrl(
          (await this.uploadFile(`${fileName}-${size}.png`, output).promise())
            .Key,
        );
      }),
    );

    const originalOutput = await sharp(input).png().toBuffer();
    results.push(
      this.publicUrl(
        (await this.uploadFile(`${fileName}.png`, originalOutput).promise())
          .Key,
      ),
    );

    return results;
  }

  private uploadFile(fileName: string, content: Buffer) {
    const params = {
      Bucket: envConfig.externalServices.s3.bucketName,
      Key: `${this.PATH_PREFIX}/${fileName}`,
      Body: content,
    };

    return this.s3.upload(params, function (err: unknown, data: unknown) {
      if (err != null) {
        throw err;
      }
      return data;
    });
  }

  private publicUrl(fileName: string) {
    return `https://${envConfig.externalServices.s3.bucketName}.s3.amazonaws.com/${fileName}`;
  }
}
